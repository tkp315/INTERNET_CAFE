import { ServiceCategoryModel } from "@/models/ServiceCategory.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
   try {
     const {categoryName}= await req.json();
     if(!categoryName){
         return NextResponse.json({
             message:"Invalid Category Id",
             statusCode:401,
         })
     }
 
     const category = await ServiceCategoryModel.findOne({name:categoryName});
 
     const allServices = category?.services;
     
     if(allServices?.length===0){
         return NextResponse.json({
             message:"No Services Found",
             statusCode:404,
         })
     }
 
     return NextResponse.json({
         message:"Successfully Fetched Services",
         statusCode:200,
         data:allServices
     })
     
   } catch (error) {
    return NextResponse.json({
        message:"Something went wrong",
        statusCode:500,
        errorMessg:error  
    })
   }

}