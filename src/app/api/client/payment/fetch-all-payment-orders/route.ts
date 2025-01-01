import Payment from "@/app/client/components/payment";
import { dbConnectionInstance } from "@/lib/db";
import { CompletionModel } from "@/models/Completion.model";
import { OtherService } from "@/models/OtherService.model";
import { PaymentModel } from "@/models/Payment.model";
import { PaymentStatus, Status } from "@/types/models.types";
import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
interface totalOrders{
    serviceOrders:any[],
    customOrders:any[]
}
export async function GET(req: NextRequest) {
  await dbConnectionInstance.connectToDB();

  try {
    const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });
    if (!token) {
      return NextResponse.json({
        message: "Login First",
        statusCode: 403,
        success: false,
      });
    }

    const orders = await CompletionModel.aggregate([
      {
        $match: {
          $and: [
            { client: new mongoose.Types.ObjectId(token._id) },
            { 
                paymentStatus: PaymentStatus.Unpaid },
          ],
        },
      },
      {
        $lookup: {
          from: "otherservices",
          localField: "customRequest",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                description: 1,
                amount: 1,
              },
            },
          ],
          as: "customOrderDetails",
        },
      },
      {
        $unwind: {
          path: "$customOrderDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "servicerequestmodels",
          localField: "request",
          foreignField: "_id",
          pipeline: [
            {
                $lookup: {
                  from: "servicemodels",
                  localField: "service",
                  foreignField: "_id",
                  pipeline: [
                    {
                      $project: {
                        name:1,
                        price: 1,
                        thumbnail:1
                      },
                    },
                  ],
                  as: "serviceDetails",
                },
              },
              {
                $unwind: {
                  path: "$serviceDetails",
                  preserveNullAndEmptyArrays: true,
                },
              },
          ],
          as: "serviceOrderDetails",
        },
      },
      {
        $unwind: {
          path: "$serviceOrderDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    const customOrders = await OtherService.find({
       $and:[
        { client:new mongoose.Types.ObjectId(token._id)},
        {paymentStatus:PaymentStatus.Unpaid},
        {status:Status.Completed}
       ]
    })

    
    const totalOrders:any = {};
    
    if(customOrders.length>0){
      totalOrders.customOrders= customOrders;
    }
    
    if(orders.length>0){
        totalOrders.serviceOrders = orders;
    }
    const isEmpty = Object.entries(totalOrders).length===0
    if(isEmpty){
        return NextResponse.json({
            message: "No Orders Found",
            statusCode: 200,
            success: false,
          });
    }
    
    return NextResponse.json({
        message: "Successfully fetched orders",
        statusCode: 200,
        success: true,
        data:totalOrders
      });
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      message: "Unexpected Error",
      statusCode: 500,
      success: false,
      error:error instanceof Error? error.message||error.stack:"Don't know exact Error "
    });
  }
}
