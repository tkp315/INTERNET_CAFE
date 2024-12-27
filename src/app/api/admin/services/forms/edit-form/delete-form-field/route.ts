import { ADMIN } from "@/lib/constants";
import  { dbConnectionInstance } from "@/lib/db";
import { FormModel } from "@/models/Form.model";
import { ServiceModel } from "@/models/Service.model";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
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
   const {insideFormId} =await req.json();
   const formId = searchParams.get('formId');
  
    if(!formId){
      return NextResponse.json({
          message:"Form Id missing",
          statusCode:404,
          success:false
      })
      
    }
  
    const forms = await FormModel.findById(formId)
    

    if(!forms){
      return NextResponse.json({
          message:"Forms not found",
          statusCode:404,
          success:false
      })
    }
       
    forms.FormField = forms.FormField.filter((e)=>e._id.toString()!==insideFormId.toString());

    await forms.save();
  
    return NextResponse.json({
      message:'Succefully Deleted the form ',
      statusCode:200,
      success:true
    })
  } catch (error) {

    return NextResponse.json({
        message:'Something went wrong',
        statusCode:500,
        success:false
      })
  }

}