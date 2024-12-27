import { dbConnectionInstance } from "@/lib/db";
import { UserModel } from "@/models/User.model";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnectionInstance.connectToDB();

  try {
    const token = getToken({ req, secret: process.env.NEXT_AUTH_SECRET });
    console.log("Got Token", token);

    const { email, phoneNo } = await req.json();

    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json({
        message: "User not found",
        statusCode: 404,
        success: false,
      });
    }

    user.phoneNo = phoneNo;
    await user.save();

    return NextResponse.json({
      message: "User Successfully updated profile",
      statusCode: 200,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Something went wrong",
      statusCode: 500,
      success: false,
    });
  }
}
