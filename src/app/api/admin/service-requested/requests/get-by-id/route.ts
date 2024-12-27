import { ADMIN } from "@/lib/constants";
import  { dbConnectionInstance } from "@/lib/db";
import { ServiceRequestModel } from "@/models/ServiceRequest.Model";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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

    if (token.role !== ADMIN) {
      return NextResponse.json({
        message: "Access Denied, Admins only",
        statusCode: 401,
        success: false,
      });
    }
    const {searchParams} =  req.nextUrl;
    const srcRequestId = searchParams.get('serviceRequestId');
    const request = await ServiceRequestModel.findById(srcRequestId);

    if (!request) {
      return NextResponse.json({
        message: "There is no Request",
        statusCode: 401,
        success: false,
      });
    }

    return NextResponse.json({
      message: "Successfully fetched the  requests",
      statusCode: 200,
      success: true,
      data: request,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Something went wrong",
      success: false,
      statusCode:500,
      error:error instanceof Error? error.message||error.stack : "Error Message"
    });
  }
}
