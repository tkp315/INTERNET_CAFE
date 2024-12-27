import { dbConnectionInstance } from "@/lib/db";
import { NotificationModel } from "@/models/Notification.model";
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

    
    const notifications = await NotificationModel.find({
     $or:[
        {recipient:token._id},
        {sender:token._id}
     ]
    }).sort({createdAt:-1})
      .populate("recipient","name email phoneNo")
      .populate("sender","name email phoneNo");

    if (!notifications || notifications.length === 0) {
      return NextResponse.json({
        message: "No Notifications Found",
        statusCode: 401,
        success: false,
      });
    }
    return NextResponse.json({
      message: "Successfully Found Notifications",
      statusCode: 200,
      success: true,
      data: notifications,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Something went wrong",
      success: false,
      statusCode: 500,
      error:
        error instanceof Error ? error.message || error.stack : "Error Message",
    });
  }
}
