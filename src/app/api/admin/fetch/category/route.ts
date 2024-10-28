import { NextRequest,NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { ServiceCategoryModel } from "@/models/ServiceCategory.model";
export async function GET (req:NextRequest){

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
    
      const category = await ServiceCategoryModel.find({});
      if (!category) {
        return NextResponse.json({
          message: "Fetching Category failed",
          statusCode: 401,
          success: false,
        });
      }
      return NextResponse.json({
        message: "Successfully Fetched all Categories",
        statusCode: 200,
        success: true,
        data : category
      });
    } catch (error) {
      return NextResponse.json({
        message: "Something went wrong",
        errorMsg: error,
      });
    }
  }
    
  