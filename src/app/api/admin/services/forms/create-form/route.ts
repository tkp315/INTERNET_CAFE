import { FormField } from "@/components/ui/form";
import { ADMIN } from "@/lib/constants";
import  { dbConnectionInstance } from "@/lib/db";
import { FormModel } from "@/models/Form.model";
import { ServiceModel } from "@/models/Service.model";
import { FormFieldItem } from "@/types/models.types";
import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    await dbConnectionInstance.connectToDB()

    try {
        const token = await getToken({req,secret:process.env.NEXT_AUTH_SECRET});
        console.log(token);
    
        if(!token){
         return NextResponse.json({
            message:"You are not loggend in ",
            success:false,
            statusCode:401
         })
        }
    
        if(token.role!==ADMIN){
            return NextResponse.json({
                message:"You are not Admin  ",
                success:false,
                statusCode:401
             })
        }
    
    
        const formData = await req.formData();
        console.log(formData);
        const  description = formData.get('description');
        const title = formData.get('title');
        const serviceId = formData.get('serviceId');
    

        
        if(!serviceId){
            return  NextResponse.json({
                message:"SERVICE ID NOT FOUND",
                success:false,
                statusCode:401
             })
        }
    
        const newForm = await FormModel.create({
          
            service:serviceId,
            description:description,
            title:title
        })
      
       const service = await ServiceModel.findById(serviceId);
       service?.Forms.push(newForm._id);
       await service?.save()
        return NextResponse.json({
            success:true,
            message:"Successfully created Form",
            statusCode:200,
            data:newForm
        })
    
    } catch (error) {
        return NextResponse.json({
            success:false,
            message:"Err: while creating form",
            errorMsg: error,
            statusCode:500
        })
    }

}