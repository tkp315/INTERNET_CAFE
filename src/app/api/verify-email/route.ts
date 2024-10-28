import connectToDB from "@/lib/db";
import { OTPModel } from "@/models/Otp.model";
import { UserModel } from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";
import otpGenerator from "otp-generator";
import { mailSender } from "@/utilities/config/emailConfig";
import { otpMarkup } from "@/utilities/templates/otpTemplate";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const { email } = await req.json();

    const user = await UserModel.findOne({ email });
    if (user) {
      return NextResponse.json({
        messaage: "User is already registerd",
        status: 404,
        success:false
      });
    }

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: false,
    });

    await OTPModel.create({
      otp:String(otp),
      email,
      expiryIn: Date.now(),
    });

    await mailSender(otpMarkup(Number(otp)), email, "Email-Verification");

    return NextResponse.json({
      message: "OTP Sent Successfully",
      otp,
      success:true,
      status:200
    });
  } catch (error) {
    return NextResponse.json({
      message: "Unable to generate OTP",
      errorMessage:error,
      success:false
    });
  }
}
