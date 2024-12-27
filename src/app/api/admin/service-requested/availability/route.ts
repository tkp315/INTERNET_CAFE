import { ADMIN } from "@/lib/constants";
import  { dbConnectionInstance } from "@/lib/db";
import { AvailabilityModel } from "@/models/Availibility.model";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

interface InputData{
    interval:string,
    date:string
}
export async function POST(req:NextRequest){
    await dbConnectionInstance.connectToDB();
    try {
        const token = await getToken({req,secret:process.env.NEXT_AUTH_SECRET});
        if (!token) {
            return NextResponse.json({
              message: "Authentication required. Please log in to continue.",
              statusCode: 401,
              success: false,
            });
          }
      
     
        
        const {interval,date}:InputData = await req.json();
         console.log (interval);
        if(!interval || !date){
            return NextResponse.json({
                message:"Interval or Date is not found",
                statusCode:404,
                success:false
            })
        }
        const time = interval.split('-');
    
          const addInAvailabilityModel = await AvailabilityModel.create({
            startTime:time[0],
            endTime:time[1],
            date:date
          })
          
          return NextResponse.json({
            message:"Added the time",
            statusCode:200,
            success:true,
            data:addInAvailabilityModel
          })
    } catch (error) {
        
        return NextResponse.json({
            message:"Something went Wrong",
            statusCode:500,
            success:false,
            error:error instanceof Error ? error.message||error.stack :"Error"
           
          })
    }
}