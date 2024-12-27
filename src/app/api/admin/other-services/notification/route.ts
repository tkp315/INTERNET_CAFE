// order confirmation,
// order completion
// order pay request
// order pay confirmation

import { ADMIN, ADMIN_TOPIC } from "@/lib/constants";
import { dbConnectionInstance } from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import admin from "@/utilities/config/firebase-admin";

import { NotificationModel } from "@/models/Notification.model";
import { UserModel } from "@/models/User.model";
import { ServiceRequestModel } from "@/models/ServiceRequest.Model";
import { OtherService } from "@/models/OtherService.model";
export interface MESSAGE_DATA_TYPE {
  title: string;
  message: string;
}
export interface InputData {
  clientId: string;
  requestId: string;
  MESSAGE_DATA: MESSAGE_DATA_TYPE;
  link?: string;
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

    if (token.role !== ADMIN) {
      return NextResponse.json({
        message: "Access denied. Admins only.",
        statusCode: 401,
        success: false,
      });
    }

    const { clientId, requestId, MESSAGE_DATA, link }: InputData =
      await req.json();

    const client = await UserModel.findById(clientId);
    if (!client) {
      return NextResponse.json({
        message: "Client not found",
        statusCode: 401,
        success: false,
      });
    }
    const request = await OtherService.findById(requestId);

    if (!request) {
      return NextResponse.json({
        message: "Service Request not found",
        statusCode: 404,
        success: false,
      });
    }

    //   const MESSAGE_DATA = {
    //     title: "SERVICE REQUEST COMPLETION",
    //     message: `Hello ${client.name}, your request(s) for ${request.requestedFunction.join(', ')} services have been COMPLETED on ${new Date().toDateString()}.`,
    //   };
    // const link = `/client/my-requests/requests`;

    if (!client.fcmToken || client.fcmToken.length === 0) {
      return NextResponse.json({
        message: "Client does not have a valid FCM token",
        statusCode: 400,
        success: false,
      });
    }

    const payload: admin.messaging.MulticastMessage = {
      tokens: client.fcmToken,
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

    const response = await admin.messaging().sendEachForMulticast(payload);

    console.log("Notification sent successfully:", response);
    const res = await NotificationModel.create({
      recipient: clientId,
      message: JSON.stringify(payload),
      customRequest: request._id,
      sender: token._id,
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
      error:
        error instanceof Error ? error.message || error.stack : "Error Message",
    });
  }
}
