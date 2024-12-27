import { ServiceType } from "@/app/dashboard/services/utils/serviceTableSchema";
import { ADMIN } from "@/lib/constants";
import  { dbConnectionInstance } from "@/lib/db";
import { ServiceModel } from "@/models/Service.model";
import { Category } from "@/models/ServiceCategory.model";
import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

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
  
    const {searchParams} = req.nextUrl;
    const serviceId = searchParams.get('serviceId')
    const sid = new mongoose.Types.ObjectId(serviceId)
    const service = await ServiceModel.aggregate([
      {
        $match: { _id:sid },
      },
      {
        $lookup: {
          from: "categories",
          foreignField: "_id",
          localField: "category",
          as: "categoryDetails",
        },
      },
      {
        $unwind: {
          path: "$categoryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "formmodels",
          localField: "Forms",
          foreignField: "_id",
          as: "formDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      {
        $unwind: {
          path: "$authorDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          isAvailable: 1,
          functions: 1,
          category: "$categoryDetails.name",
          categoryId: "$categoryDetails._id",
          createdBy: "$authorDetails.name",
          forms: "$formDetails",
          thumbnail: 1,
          createdAt: 1,
        },
      },
    ]);
    
      if(!service) {
        return NextResponse.json({
            message: "Service not found",
            statusCode: 404,
            success: false,
          });
      }
    return NextResponse.json({
      message: "Successfully got service",
      data:  service[0] ,
      success: true,
      statusCode: 200,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Unexpected Error",
      statusCode: 500,
      success: false,
    });
  }
}
