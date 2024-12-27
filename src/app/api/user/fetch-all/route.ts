import { ADMIN } from "@/lib/constants";
import  { dbConnectionInstance } from "@/lib/db";
import { UserModel } from "@/models/User.model";
import { User } from "lucide-react";
import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req:NextApiRequest){
    await dbConnectionInstance.connectToDB()
 try {
    const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });
    if(!token){
        return NextResponse.json({
            message:'login first',
            statusCode:400,
            success:false
        })
    }
    const role = token?.role
    if(role!==ADMIN){
        throw Error('You are not authorised');
    }
    
    const users = await UserModel.find({})
    // .populate("MyRequestedServices")
    .select("name email phoneNo");
    return NextResponse.json({
        message: "Successfully fetched Users",
        statusCode: 200,
        success: true,
        data:users
    })
    
 } 
 catch (error) {
    return NextResponse.json({
        message: "Something went wrong",
        errorMsg: error,
      });
 }  
}