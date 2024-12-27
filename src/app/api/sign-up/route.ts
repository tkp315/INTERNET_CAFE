import  { dbConnectionInstance } from "@/lib/db";
import { OTPModel } from "@/models/Otp.model";
import { UserModel } from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    await dbConnectionInstance.connectToDB();
    const { email, name, password, phoneNo, otp, confirmPassword } =
      await req.json();
    // validation done by zod there

    if (
      [email, name, password, phoneNo, otp, confirmPassword].some(
        (item) => item === ""
      )
    ) {
      return NextResponse.json({
        message: "Some Fields are missing",
        statusCode: 401,
        success: false,
      });
    }

    const findUser = await UserModel.findOne({
      $or:[{email},{phoneNo}]
    });
    if (findUser) {
      return NextResponse.json({
        message: "User already Registered with this email",
        statusCode: 401,
        success: false,
      });
    }

    const OTP = await OTPModel.findOne({ email }).sort({ expiryIn: -1 });
    if (!OTP) {
      return NextResponse.json({
        message: "OTP expired or not Sent",
        statusCode: 401,
        success: false,
      });
    }

    const isCorrectOTP = otp === String(OTP.otp);

    if (!isCorrectOTP) {
      return NextResponse.json({
        message: "Incorrect OTP",
        statusCode: 401,
        success: false,
      });
    }

    const isCorrectPassword = password === confirmPassword;
    if (!isCorrectPassword) {
      return NextResponse.json({
        message: "Password not matched",
        statusCode: 401,
        success: false,
      });
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const isAdmin = await UserModel.findOne({ role: "Admin" });
    console.log(isAdmin)
    const newUser = await UserModel.create({
      name,
      email,
      password: encryptedPassword,
      phoneNo,
      isVerified: true,
      
    });
    

    const user = await UserModel.findById(newUser._id).select("-password");

    return NextResponse.json({
      message: "New User created Successfully",
      data: user,
      success: true,
      statusCode: 200,
    });

  } catch (error) {
    console.log("ERR: error while creating user", error);
    return NextResponse.json({
      message: "Something Went Wrong",
      success: false,
      statusCode: 500,
    });
  }
}
