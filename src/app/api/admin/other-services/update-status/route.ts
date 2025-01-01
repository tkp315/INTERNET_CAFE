import admin from "firebase-admin";
import { ADMIN } from "@/lib/constants";
import { dbConnectionInstance } from "@/lib/db";
import { ServiceRequestModel } from "@/models/ServiceRequest.Model";
import { PaymentStatus, Status } from "@/types/models.types";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { NotificationModel } from "@/models/Notification.model";
import { CompletionModel } from "@/models/Completion.model";
import { UserModel } from "@/models/User.model";
import { OtherService } from "@/models/OtherService.model";

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
        message: "Access Denied, Admins only",
        statusCode: 401,
        success: false,
      });
    }
    const { requestId, status } = await req.json();

    const request = await OtherService.findById(requestId).populate(
      "client"
    );

    if (!request) {
      return NextResponse.json({
        message: "Request not found",
        statusCode: 401,
        success: false,
      });
    }

    request.status = status;
    await request.save();

    if (request.status === Status.Completed) {
      const MESSAGE_DATA = {
        title: "PAYMENT REMINDER",
        message: `Hello ${request.client.name}, your Work Completed on ${new Date().toDateString()}. PAY the service amount and take the receipt.`,
      };
      const link = `/client/my-requests/requests`;
    
      try {
        // Check if the client has valid FCM tokens
        if (!request.client.fcmToken || request.client.fcmToken.length === 0) {
          return NextResponse.json({
            message: "Client does not have a valid FCM token",
            statusCode: 400,
            success: false,
          });
        }
    
        const payload: admin.messaging.MulticastMessage = {
          tokens: request.client.fcmToken,
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
    
        // Send notifications
        const response = await admin.messaging().sendEachForMulticast(payload);
    
        // Log success and handle failed tokens
        console.log("Notification sent successfully:", response.responses);
    
        // Loop through responses to check for failed token deliveries
        response.responses.forEach(async (res, index) => {
          if (!res.success) {
            console.error(`Failed to send notification to token ${request.client.fcmToken[index]}:`, res.error);
    
            
            await UserModel.findByIdAndUpdate(request.client._id, {
              $pull: { fcmToken: request.client.fcmToken[index] },
            });
          }
        });
        
       // save the notification here also 
       await NotificationModel.create({
        message:JSON.stringify(payload),
        sender:token._id,
        recipient:request.client._id,
        customRequest:requestId
       })


        return NextResponse.json({
          message: "Request updated",
          statusCode: 200,
          success: true,
          data: request.status,
        });
      } 
      
      catch (error) {
        return NextResponse.json({
          message: "Failed to send the message",
          success: false,
          statusCode: 500,
          error: error instanceof Error ? error.message || error.stack : "Error Message",
        });
      }

    }
    

    
    return NextResponse.json({
      message: "Request updated",
      statusCode: 200,
      success: true,
      data: request.status,
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
