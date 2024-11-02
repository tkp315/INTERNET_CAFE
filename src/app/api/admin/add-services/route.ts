import connectToDB from "@/lib/db";
import { ServiceModel } from "@/models/Service.model";
import { ServiceCategoryModel } from "@/models/ServiceCategory.model";
import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import DatauriParser from "datauri/parser";
import path from "path";
import { cloudinary } from "@/lib/cloudinary";

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
    const functionsFile = formData.get('functionsFile') as File | null;
    
   
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
   
    let functionsFromFile:string[]=[];

    if(functionsFile && functionsFile instanceof File){
        const functionFilePath  = await functionsFile.arrayBuffer()
        const functionFileText = Buffer.from(functionFilePath).toString('utf8')
        console.log(functionFileText)
        functionsFromFile = functionFileText.split("\n").map((line)=>line.trim()).filter((line)=>line)
        console.log(functionsFromFile)
    }


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
        category:categoryId,
        thumbnail: createdImage.secure_url,
        functions:functionsFromFile||allFunctions,
        createdBy:new mongoose.Types.ObjectId(token?._id),
     
    })

    const addingServices = await ServiceCategoryModel.findByIdAndUpdate(categoryId,{
      
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