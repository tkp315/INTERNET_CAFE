import { ADMIN, ADMIN_TOPIC } from "@/lib/constants";
import { dbConnectionInstance } from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import admin from "@/utilities/config/firebase-admin";
import { NotificationModel } from "@/models/Notification.model";
import { UserModel } from "@/models/User.model";

export async function POST(req: NextRequest) {
  await dbConnectionInstance.connectToDB();

  try {
    const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });

    if (!token) {
      return NextResponse.json({
        message: "Log In First",
        statusCode: 401,
        success: false,
      });
    }

    const client = await UserModel.findById(token._id);
    const Admin = await UserModel.findOne({role:ADMIN});
    if(!Admin){
      return NextResponse.json({
        message: "Receiver not found which is admin ",
        statusCode: 401,
        success: false,
      });
    }

    const { serviceName, functions } = await req.json();
    const MESSAGE_DATA = {
      title: "SERVICE REQUESTED",
      message: `${client?.name} requested ${functions.join(
        ","
      )} in service ${serviceName.toUpperCase()} on
      ${new Date().toDateString()} `,
    };
    const link = `/dashboard/requests`;

    const payload: admin.messaging.Message = {
      topic: ADMIN_TOPIC,
      notification: {
        title: MESSAGE_DATA.title,
        body: MESSAGE_DATA.message,
      },
      webpush: link
        ? {
            fcmOptions: {
              link,
            },
          }
        : undefined,
    };

    
    const response = await admin.messaging().send(payload);

    console.log("Notification sent successfully:", response);
    const res = await NotificationModel.create({
      recipient: Admin._id,
      message: JSON.stringify(payload),
      sender:token._id
    });

    if (!res._id) {
      return NextResponse.json({
        message: "Unable to save in notification model",
        statusCode: 500,
        success: false,
      });
    }

    return NextResponse.json({
      message: "Successfully sent a notification",
      statusCode: 200,
      success: true,
    });
  } catch (error) {
    console.error("Error sending notification:", error);

    return NextResponse.json({
      message: "Something went wrong",
      statusCode: 500,
      success: false,
    });
  }
}
