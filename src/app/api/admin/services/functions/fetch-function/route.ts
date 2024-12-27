import { ADMIN } from "@/lib/constants";
import  { dbConnectionInstance } from "@/lib/db";
import { FormModel } from "@/models/Form.model";
import { ServiceModel } from "@/models/Service.model";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
  await dbConnectionInstance.connectToDB();


  try {
    const token = await getToken({req,secret:process.env.NEXT_AUTH_SECRET});
    if(!token){
      return NextResponse.json({
          message:"Log in first",
          statusCode:404,
          success:false
      })
    }
    const role= token.role;
    if(role!=ADMIN){
      return NextResponse.json({
          message:"You are not Admin",
          statusCode:404,
          success:false
      })
    }
  
   const {searchParams}= req.nextUrl;
   const serviceId = searchParams.get('serviceId');
  
    if(!serviceId){
      return NextResponse.json({
          message:"Service Id missing",
          statusCode:404,
          success:false
      })
      
    }
  
    const service= await ServiceModel.findById(serviceId)


    if(!service){
      return NextResponse.json({
          message:"Service not found",
          statusCode:404,
          success:false
      })
    }
  const functions = service.functions;
  
    return NextResponse.json({
      message:'Succefully fetched all functions in this service',
      data:functions,
      statusCode:200,
      success:true
    })
  } catch (error) {

    // console.log(error)
    return NextResponse.json({
        message:'Something went wrong',
        statusCode:500,
        success:false
      })
  }

}