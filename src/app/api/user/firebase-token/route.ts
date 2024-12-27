import { ADMIN, ADMIN_TOPIC } from "@/lib/constants";
import { dbConnectionInstance } from "@/lib/db";
import admin from 'firebase-admin'
import { UserModel } from "@/models/User.model";

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECTID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
} else {
  console.log("Firebase app already initialized");
}
export async function POST(req: NextRequest) {
  await dbConnectionInstance.connectToDB();
  try {
    const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });
  
    if (!token) {
      return NextResponse.json({
        message: "You are not logged in",
        statusCode: 401,
        success: false,
      });
    }
    const {fcmToken}= await req.json();
  
    const user = await UserModel.findById(token._id);
    if(!user?.fcmToken.includes(fcmToken)){
      user?.fcmToken.push(fcmToken)
    }
    await user?.save()

    if (token.role === ADMIN) {
        try {
          
          const res = await admin.messaging().subscribeToTopic([fcmToken], ADMIN_TOPIC);
          console.log(`Successfully subscribed token to topic: ${ADMIN_TOPIC}`, res);
          if (res.failureCount > 0) {
              console.log("Errors:", res.errors);
            }
        } catch (error) {
          console.error(`Error subscribing token to topic: ${ADMIN_TOPIC}`, error);
        }
      }
  
    return NextResponse.json({
      message:"Token saved",
      statusCode:200,
      success:true
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({
        message:"Something went wrong",
        statusCode:500,
        success:false
      })
  }

}
