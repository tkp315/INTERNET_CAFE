import { ADMIN } from "@/lib/constants";
import { dbConnectionInstance } from "@/lib/db";
import { CompletionModel } from "@/models/Completion.model";
import { PaymentModel } from "@/models/Payment.model";
import { PaymentStatus } from "@/types/models.types";

import crypto from "crypto";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

interface InputData {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
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

   

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      await req.json();
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isVerified = expectedSignature === razorpay_signature ? true : false;

    if (!isVerified) {
      return NextResponse.json({
        message: "Payment Verification Failed",
        statusCode: 404,
        success: false,
      });
    }

    console.log(razorpay_order_id)
    const paymentDetails = await PaymentModel.findOne({
      orderId: razorpay_order_id,
    });

    if (!paymentDetails) {
      return NextResponse.json({
        message: "purchase record not found",
        statusCode: 500,
        success: false,
      });
    }

    paymentDetails.status = PaymentStatus.Paid;
    await paymentDetails.save();

    //    send the notification of payment cofirmation here
    // redirect(
    //   `http://localhost:3000/payment/verify?refrence=${req.body.razorpay_payment_id}`
    // );
  const completion = await CompletionModel.findOne({request: paymentDetails.serviceRequested._id})

  if(completion){
  completion.paymentStatus=PaymentStatus.Paid;
  completion.paymentDetails= paymentDetails._id
   await completion.save()
    
  }
    console.log(isVerified)
    return NextResponse.json({
      message: "Payment Verified",
      statusCode: 200,
      success: true,
     data:isVerified
    });
  } catch (error) {
    console.error("Error verifying the payment:", error);

    return NextResponse.json({
      message: "Something went wrong",
      statusCode: 500,
      success: false,
      error: error instanceof Error ? error.message : error,
    });
  }
}
