import { dbConnectionInstance } from "@/lib/db";
import { ServiceModel } from "@/models/Service.model";
import { Category } from "@/models/ServiceCategory.model";
import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import DatauriParser from "datauri/parser";
import path from "path";
import { cloudinary, ResourceType, uploadOnCloudinary } from "@/lib/cloudinary";
import { ADMIN, CLOUDINARY_MAX_RETRIES, CLOUDINARY_RETRY_INTERVAL } from "@/lib/constants";

export async function POST(req: NextRequest) {
  await dbConnectionInstance.connectToDB();

  try {
    const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });
    const role = token?.role;
    if (!token) {
      return NextResponse.json({
        message: "Authentication required. Please log in to continue.",
        statusCode: 401,
        success: false,
      });
    }

    if (role !== ADMIN) {
      return NextResponse.json({
        message: "Access denied. Admins only.",
        statusCode: 200,
        success: false,
      });
    }

    const formData = await req.formData();
    const categoryId = formData.get("categoryId") as string | null;
    const serviceName = formData.get("serviceName") as string | null;
    const servicePrice = formData.get("servicePrice") as string | null;
    const isAvailable = formData.get("isAvailable") as boolean | null;
    const thumbnail = formData.get("thumbnail") as File | null;
    const functions = formData.getAll("functions") as Array<String>;
    const functionsFile = formData.get("functionsFile") as File | null;

    const allFunctions = Array.isArray(functions)
      ? functions
      : JSON.parse(functions);
    console.log(formData);

    if (!thumbnail || !(thumbnail instanceof File)) {
      throw new Error("Thumbnail is required and must be a file");
    }

    const thumbnailPath = await thumbnail.arrayBuffer();
    const buffer = Buffer.from(thumbnailPath);

    // Upload the new image
    const parser = new DatauriParser();
    const base64Image = parser.format(
      path.extname(thumbnail.name).toString(),
      buffer
    );

    if (!base64Image.content) {
      return NextResponse.json({
        message: "Failed to parse",
        success: false,
        statusCode: 500,
      });
    }
    const createdImage=await uploadOnCloudinary(base64Image.content,process.env.CLOUDINARY_FOLDER_SERVICE!,ResourceType.AUTO,0);
   

    let functionsFromFile: string[] = [];

    if (functionsFile && functionsFile instanceof File) {
      const functionFilePath = await functionsFile.arrayBuffer();
      const functionFileText = Buffer.from(functionFilePath).toString("utf8");
      console.log(functionFileText);
      functionsFromFile = functionFileText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line);
      console.log(functionsFromFile);
    }

    const isServiceExist = await ServiceModel.findOne({ name: serviceName });

    if (isServiceExist) {
      return NextResponse.json({
        message: "This service  already exists",
        statusCode: 401,
        success: false,
      });
    }

    const newService = await ServiceModel.create({
      name: serviceName,
      isAvailable,
      price: servicePrice,
      category: categoryId,
      thumbnail: createdImage.secure_url,
      functions: functionsFromFile || allFunctions,
      createdBy: new mongoose.Types.ObjectId(token?._id),
    });

    const addingServices = await Category.findByIdAndUpdate(categoryId, {
      $push: {
        services: newService._id,
      },
    });

    return NextResponse.json({
      message: "Service added successfully",
      statusCode: 200,
      success: true,
      data: newService,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Unable to add new Service",
      statusCode: 500,
      success: false,
      error:error instanceof Error? error.message:"Error Message"
    });
  }
}
