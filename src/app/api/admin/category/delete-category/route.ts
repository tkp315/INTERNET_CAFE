import { ADMIN } from "@/lib/constants";
import  { dbConnectionInstance } from "@/lib/db";
import { Category} from "@/models/ServiceCategory.model";

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

interface InputData{
    categoryId:string
}

export async function POST(req:NextRequest){
    await dbConnectionInstance.connectToDB();
    try {
        const token = await getToken({req,secret:process.env.NEXT_AUTH_SECRET});
        const role = token?.role;

        if(!token){
            return NextResponse.json({
                message:"Authentication required. Please log in to continue.",
                statusCode:401,
                success:false
            }) 
        }

        if(role!==ADMIN){
            return NextResponse.json({
                message:"Access denied. Admins only.",
                statusCode:401,
                success:false
            })
        }
        const{categoryId}:InputData = await req.json()
         await Category.findByIdAndDelete(categoryId);

         return NextResponse.json({
            message:"Successfully Deleted Category",
            statusCode:200,
            success:true
         })
    }
    catch(err){
        return NextResponse.json({
            message:"Something went wrong",
            statusCode:500,
            success:false,
            error:err instanceof Error ? err.stack||err.message :"Error Message"
         })
    }
}