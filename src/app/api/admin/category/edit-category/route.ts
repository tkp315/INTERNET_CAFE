import { ADMIN } from "@/lib/constants";
import  { dbConnectionInstance } from "@/lib/db";
import { Category } from "@/models/ServiceCategory.model";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

interface InputData{
  name:string;
  description:string;
  isAvailable:boolean;
  categoryId:string;
}
export async function POST(req: NextRequest) {
  await dbConnectionInstance.connectToDB();
  try {
    const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });
    if (!token) {
      return NextResponse.json({
        message: "Authentication required. Please log in to continue.",
        statusCode: 401,
        success: false,
      });
    }
    const role = token?.role;

    if (role !== ADMIN) {
      return NextResponse.json({
        message: "Access denied. Admins only.",
        statusCode: 401,
        success: false,
      });
    }

    const data:InputData = await req.json();

    const category = await Category.findById(data.categoryId);

    if (!category) {
      return NextResponse.json({
        message: "Category not found",
        statusCode: "401",
        success: false,
      });
    }

    category.name = data.name || category.name;
    category.description = data.description || category.description;
    category.isAvailable = data.isAvailable || category.isAvailable;

    await category.save();

    return NextResponse.json({
      message: "Category  updated successfully",
      statusCode: 200,
      success: true,
    });
  } catch (err) {
    return NextResponse.json({
      message: "Unexpected Error",
      statusCode: 500,
      success: false,
      error:err instanceof Error ?err.message||err.stack :"Error Message"
    });
  }
}
