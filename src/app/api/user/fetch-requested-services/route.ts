import { ADMIN } from "@/lib/constants";
import  { dbConnectionInstance } from "@/lib/db";
import { ServiceRequestModel } from "@/models/ServiceRequest.Model";
import { UserModel } from "@/models/User.model";
import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await dbConnectionInstance.connectToDB();

  try {
    const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });
    if (!token) {
      return NextResponse.json({
        message: "Log in First",
        statusCode: 401,
        success: false,
      });
    }
    const userId = token._id;
   const query: any = {
        client: new mongoose.Types.ObjectId(token._id), // Always match the client
      };
      const filters: any[] = [];
      query.client = new mongoose.Types.ObjectId(token._id);
      const limit = 10;
      const { searchParams } = req.nextUrl;
      const search = searchParams.get("search");
      const page = parseInt(searchParams.get("page") || "1");
      const completed = searchParams.get("completed");
      const ongoing = searchParams.get("ongoing");
      const paid = searchParams.get("paid");
      const pending = searchParams.get("pending");
      const unpaid = searchParams.get("unpaid");
      const skip = limit * (page - 1);
  
      //    **********payment status *******************
      const paymentFilter:any = []
      const paymentQuery:any={}
      if (paid === "true" && unpaid === "false") paymentFilter.push({ paid: true });
      if (paid === "false" && unpaid === "true") paymentFilter.push({ paid: false });
      if (paid === "true" && unpaid === "true") {
        paymentFilter.push({ paid: true });
        paymentFilter.push({ unpaid: true });
      }
  
      if(paymentFilter.length>0){
        paymentQuery.$or=paymentFilter
      }
      // ******************status***********
      if (completed === "true") filters.push({ completed: true });
      if (ongoing === "true") filters.push({ ongoing: true });
      if (pending === "true") filters.push({ pending: true });
  
      if (search!=='') {
        filters.push({ name: { $regex: search, $options: "i" } });
      }
  
      if (filters.length > 0) {
        query.$or = filters;
      }

    const services = await ServiceRequestModel.aggregate([
      {
        $match: {
          client: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "servicemodels",
          foreignField: "_id",
          localField: "service",
          pipeline:[
           {
            $project:{
                name:1,
                thumbnail:1,
                price:1
            }
           }
          ],
          as: "ServiceDetails",
        },
      },
      {
        $unwind:{
            path:'$ServiceDetails',
            preserveNullAndEmptyArrays:true
        }
      },
      {
        $lookup:{
          from: "availabilitymodels",
          foreignField: "_id",
          localField: "completion",
          as: "CompletionDetails",
        }
      },
      {
        $unwind:{
            path:'$CompletionDetails',
            preserveNullAndEmptyArrays:true
        }
      },
      {
        $lookup:{
          from: "paymentmodels",
          foreignField: "_id",
          localField: "payment",
          as: "paymentDetails",
        }
      },
      {
        $unwind:{
            path:'$paymentDetails',
            preserveNullAndEmptyArrays:true
        }
      },
      {
        $lookup:{
          from: "completionmodels",
          foreignField: "_id",
          localField: "taskCompletion",
          as: "taskCompletionDetails",
        }
      },
      {
        $unwind:{
            path:'$taskCompletionDetails',
            preserveNullAndEmptyArrays:true
        }
      },
      {
        $facet: {
          metadata: [{ $count: "totalDocs" }],
          docs: [{ $skip: skip }, { $limit: limit }],
        },
      },
      {
        $addFields: {
          "metadata.page": page,
          "metadata.limit": limit,
        },
      },
    ]);

    if (!services || services.length === 0) {
      return NextResponse.json({
        message: "User not found",
        statusCode: 401,
        success: false,
      });
    }

    const reqeuestDetails = services[0];
    const totalDocs = reqeuestDetails.metadata[0]?.totalDocs || 0;
    const totalPages = Math.ceil(totalDocs / limit);
   

    const paginationData = {
      totalPages,
      totalDocs,
      page,
      limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return NextResponse.json({
      message: "Successfully fetched user",
      statusCode: 200,
      success: true,
      // data:user[0].orders
      data: {
        requestData:reqeuestDetails.docs,
        paginationData
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: error.response.message || "Something went wrong",
      statusCode: 401,
      success: false,
    });
  }
}
