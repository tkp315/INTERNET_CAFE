import { ADMIN } from "@/lib/constants";
import  { dbConnectionInstance } from "@/lib/db";
import { ServiceModel } from "@/models/Service.model";

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    await dbConnectionInstance.connectToDB();
    try {
        const token = await getToken({req,secret:process.env.NEXT_AUTH_SECRET});
        const role = token?.role;

        if(role!==ADMIN){
            return NextResponse.json({
                message:"You are not authorized",
                statusCode:401,
                success:false
            })
        }
        const {searchParams} = req.nextUrl;
        const serviceId = searchParams.get('serviceId');
         await ServiceModel.findByIdAndDelete(serviceId);

         return NextResponse.json({
            message:"Successfully Deleted Service",
            statusCode:200,
            success:true
         })
    }
    catch(err){
        return NextResponse.json({
            message:"Unexpected Error",
            statusCode:500,
            success:false
         })
    }
}