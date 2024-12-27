import { ADMIN,  } from "@/lib/constants";
import { dbConnectionInstance } from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

import { NotificationModel } from "@/models/Notification.model";
import { UserModel } from "@/models/User.model";
import { ServiceRequestModel } from "@/models/ServiceRequest.Model";
import { InputData } from "../order-completion/route";
import admin from "@/utilities/config/firebase-admin";


// send data use model(CompletionModle) to save the data
// this is dummy not actual 

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
     const {clientId,requestId}:InputData = await req.json();
     const client = await UserModel.findById(clientId);
     if(!client){
        return NextResponse.json({
            message: "Client not found",
            statusCode: 401,
            success: false,
          });
     }
     const request = await ServiceRequestModel.findById(requestId);

     if (!request) {
        return NextResponse.json({
          message: "Service Request not found",
          statusCode: 404,
          success: false,
        });
      }
      if (!request.requestedFunction || request.requestedFunction.length === 0) {
        return NextResponse.json({
          message: "Invalid service request functions",
          statusCode: 400,
          success: false,
        });
      }
   
      const MESSAGE_DATA = {
        title: "SERVICE RECIEPT DATA",
        message: `Hello ${client.name}, your all the information for ${request.requestedFunction.join(', ')} services has been deleted on ${new Date().toDateString()}.`,
      };
    const link = `/client/my-requests/requests`;

    if (!client.fcmToken || client.fcmToken.length === 0) {
        return NextResponse.json({
          message: "Client does not have a valid FCM token",
          statusCode: 400,
          success: false,
        });
      }

    const payload: admin.messaging.MulticastMessage = {
      tokens:client.fcmToken,
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
      serviceRequest:request._id,
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
      error:error instanceof Error ? error.message || error.stack :"Error Message"
    });
  }
}
