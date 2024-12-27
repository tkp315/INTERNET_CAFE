import { ADMIN } from "@/lib/constants";
import { dbConnectionInstance } from "@/lib/db";
import { Category } from "@/models/ServiceCategory.model";
import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
// import { NextResponse } from "next/server";

interface InputData {
  serviceCategoryName: string;
  description: string;
}

export async function POST(req: NextRequest) {
  await dbConnectionInstance.connectToDB();
  try {
    const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });
    const role = token?.role;
    if (!token) {
      return NextResponse.json({
        message: "Authentication required. Please log in to continue.",
        statusCode: 401,
        success: false,
      });
    }

    if (role !== ADMIN) {
      return NextResponse.json({
        message: "Access denied. Admins only.",
        statusCode: 200,
        success: false,
      });
    }

    const { serviceCategoryName, description }: InputData = await req.json();

    const category = await Category.findOne({
      name: serviceCategoryName,
    });

    if (category) {
      return NextResponse.json({
        message: "Category already exists.",
        statusCode: 401,
        success: false,
      });
    }

    const newCategory = await Category.create({
      name: serviceCategoryName,
      description,
      createdAt: Date.now(),
      isAvailable: true,
      createdBy: new mongoose.Types.ObjectId(token?._id),
    });

    return NextResponse.json({
      message: " Category created successfully",
      statusCode: 200,
      success: true,
      data: newCategory,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Something went wrong",
      success: false,
      statusCode: 500,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
