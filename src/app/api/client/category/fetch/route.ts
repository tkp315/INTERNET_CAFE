import { NextRequest, NextResponse } from "next/server";
import  { dbConnectionInstance } from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { Category } from "@/models/ServiceCategory.model";
import { CategoryType } from "@/app/schemas/categoryTableSchema";
import { ADMIN } from "@/lib/constants";

export async function GET(req: NextRequest) {
  await dbConnectionInstance.connectToDB();
  try {
    const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });
    const role = token?.role;
    if (token === null) {
      return NextResponse.json({
        message: "You are not logged in",
      });
    }
    
    

    let tableData: Array<CategoryType> = [];
   

    // Fetch categories and populate 'createdBy'
    const category = await Category.find({}).populate('createdBy')
    .populate('services');

    if (!category || category.length === 0) {
      return NextResponse.json({
        message: "Fetching categories failed",
        statusCode: 404,
        success: false,
      });
    }

    // Process each category and build tableData
    await Promise.all(
      category.map(async (cat) => {
        const name = cat.name;
        const services = cat.services.length;
        const isAvailable = cat.isAvailable;
        const updatedAt = cat.createdAt.toDateString();
        const description = cat.description
        const createdUser = await cat.populate('createdBy') || ''; 
        const _id = String(cat._id);

        // Push data to tableData
        tableData.push({ name, services, isAvailable, updatedAt, createdBy:cat.createdBy.name,description, _id});
      })
    );

    return NextResponse.json({
      message: "Successfully Fetched all Categories",
      statusCode: 200,
      success: true,
      data: {
        categories: category,
        tableData
       }
      }) ;
  } catch (error) {
    return NextResponse.json({
      message: "Something went wrong",
      errorMsg: error,
    });
  }
}
