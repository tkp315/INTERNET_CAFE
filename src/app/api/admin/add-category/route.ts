import connectToDB from "@/lib/db";
import { ServiceCategoryModel } from "@/models/ServiceCategory.model";
import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
// import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectToDB();
  try {
    const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });
    const role = token?.role;
    if(token===null){
      return NextResponse.json({
        message: "You are not logged in",
      });
    }
    console.log(role)
    if (role === "Client") {
      return NextResponse.json({
        message: "This is protected route",
      });
    }
    const { serviceCategoryName, description } = await req.json();
    const category = await ServiceCategoryModel.findOne({
      name: serviceCategoryName,
    });
    if (category) {
      return NextResponse.json({
        message: "This category is already exist",
        statusCode: 401,
        success: false,
      });
    }

    const newCategory = await ServiceCategoryModel.create({
      name: serviceCategoryName,
      description,
      createdAt: Date.now(),
      isAvailable:true,
      createdBy:new mongoose.Types.ObjectId(token?._id)
    });

    return NextResponse.json({
      message: "new Category created Successfully",
      statusCode: 200,
      success: true,
      data : newCategory
    });
  } catch (error) {
    return NextResponse.json({
      message: "Something went wrong",
      errorMsg: error,
    });
  }
}

