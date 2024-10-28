import connectToDB from "@/lib/db";
import { backendClient } from "@/lib/edgestore-server";
import { ServiceModel } from "@/models/Service.model";
import { ServiceCategoryModel } from "@/models/ServiceCategory.model";
import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import DatauriParser from "datauri/parser";
import path from "path";
import { cloudinary, uploadOnCloudinary } from "@/lib/cloudinary";

export async function POST (req:NextRequest){
    await connectToDB();
    try {
        const token = await getToken({req,secret:process.env.NEXT_AUTH_SECRET});
    console.log(token);

    if(token?.role==="Client"){
        return NextResponse.json({
            message:"This is protected route",
            statusCode:404,
            success:false

        })
    }
    const formData=await req.formData()
    const categoryId = formData.get('categoryId') as string|null;
    const serviceName = formData.get('serviceName') as string|null ;
    const servicePrice = formData.get('servicePrice')as string|null;
    const isAvailable = formData.get('isAvailable') as boolean |null ;
    const thumbnail = formData.get('thumbnail') as File |null;
    const functions = formData.getAll('functions')as Array<string>

    const allFunctions = Array.isArray(functions) ? functions:JSON.parse(functions);
    console.log(formData)

    if(!thumbnail || !(thumbnail instanceof File)){
        throw new Error("Thumbnail is required and must be a file")
    }

    const thumbnailPath= await thumbnail.arrayBuffer()
    const buffer = Buffer.from(thumbnailPath);

    // Upload the new image
    const parser = new DatauriParser();
    const base64Image = parser.format(
      path.extname(thumbnail.name).toString(),
      buffer
    );

    if (!base64Image.content) {
      return NextResponse.json(
        { message: "Failed to parse", success: false },
        { status: 500 }
      );
    }
    
    const createdImage = await cloudinary.uploader.upload(
        base64Image.content,
        {
          resource_type:"auto",
        }
      );
    // const createdImage = await uploadOnCloudinary(base64Image.content,'Shop-app')
    // console.log(createdImage)
    const cid = new mongoose.Types.ObjectId(categoryId);

    const isServiceExist = await ServiceModel.findOne({name:serviceName});

    if(isServiceExist){
        return NextResponse.json({
            message:"This service is already exists",
            statusCode:401,
            success:false
        })
    }
   
    const newService = await ServiceModel.create({
        name:serviceName,
        isAvailable,
        price:servicePrice,
        category:cid,
        thumbnail: createdImage.secure_url,
        functions:allFunctions,
        createdBy:new mongoose.Types.ObjectId(token?._id)
    })

    const addingServices = await ServiceCategoryModel.findByIdAndUpdate(cid,{
      
        $push:{
            services:newService._id
        }
    });

    return NextResponse.json({
        message:"service added ",
        statusCode:200,
        success:true,
        data:newService
    })

    } catch (error) {
     return NextResponse.json({
        message:"Unable to add new Service",
        statusCode:500,
        success:false

    })   
    }
}