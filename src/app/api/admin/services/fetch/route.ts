import { ServiceType } from "@/app/dashboard/services/utils/serviceTableSchema";
import { ADMIN } from "@/lib/constants";
import  { dbConnectionInstance } from "@/lib/db";
import { ServiceModel } from "@/models/Service.model";
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
    const role = token?.role;

    const serviceResult = await ServiceModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
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
          thumbnail:1,
          createdAt: 1,
        },
      },
    ]);

    
    if (!serviceResult || serviceResult.length === 0) {
      return NextResponse.json({
        message: "Services not found",
        statusCode: 404,
        success: false,
      });
    }
    const tableData: Array<ServiceType> = serviceResult.map((service) => {
     return {
        name: service.name,
        price: Number(service.price),
        category: service.category,
        catedoryId: service.categoryId,
        isAvailable: service.isAvailable,
        createdBy: service.createdBy,
        createdAt:service.createdAt,
        thumbnail:service.thumbnail,
        functions:service.functions,
        forms:service.forms,
        _id: String(service._id),
     }
    });

    return NextResponse.json({
      message: "Successfully got services",
      data: role === ADMIN ? { tableData, serviceResult } : serviceResult,
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
