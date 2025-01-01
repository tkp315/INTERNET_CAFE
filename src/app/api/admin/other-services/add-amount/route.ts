import { ADMIN } from "@/lib/constants";
import { dbConnectionInstance } from "@/lib/db";
import { OtherService } from "@/models/OtherService.model";
import { PaymentModel } from "@/models/Payment.model";
import { ServiceRequestModel } from "@/models/ServiceRequest.Model";
import { PaymentStatus, PaymentType, Status } from "@/types/models.types";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { RazorpayPaginationOptions } from "razorpay/dist/types/api";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

interface InputData {
  requestId:string,
      amount:string,
      redirectUrl:string,
      serviceName:string,
      createdAt:string,
      clientName:string,
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

    if(token.role!==ADMIN){
        return NextResponse.json({
            message: "Access denied. Admins only.",
            statusCode: 401,
            success: false,
          });
    }
   
    const {requestId,amount}= await req.json();
    const request = await OtherService.findById(requestId);
    if(!request){
        return NextResponse.json({
            message: "Unable to find request",
            statusCode: 500,
            success: false,
          });
    }
    request.amount = amount ;
     await request.save();
     return NextResponse.json({
        message: "Successfully added amount",
        statusCode: 200,
        success: true,
        
      });
    
  } catch (error) {
    console.error("Error creating order:", error);

    return NextResponse.json({
      message: "Something went wrong",
      statusCode: 500,
      success: false,
      error: error instanceof Error ? error.message : error,
    });
  }
}
