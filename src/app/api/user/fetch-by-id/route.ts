import { ADMIN } from "@/lib/constants";
import  { dbConnectionInstance } from "@/lib/db";
import { ServiceRequestModel } from "@/models/ServiceRequest.Model";
import { UserModel } from "@/models/User.model";
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
    const {searchParams} =req.nextUrl;
    const userId = searchParams.get('userId');
    const user = await UserModel.findById(userId)
    .select('-password -MyRequestedServices')

    if(!user){
        return NextResponse.json({
            message: "User not found",
            statusCode: 401,
            success: false,
          });
    }

    return NextResponse.json({
        message: "Successfully fetched user",
        statusCode: 200,
        success: true,
        data:user
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
