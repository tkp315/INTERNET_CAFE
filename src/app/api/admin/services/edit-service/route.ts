import { cloudinary } from "@/lib/cloudinary";
import { ADMIN } from "@/lib/constants";
import  { dbConnectionInstance } from "@/lib/db";
import { ServiceModel } from "@/models/Service.model";
import DataURIParser from "datauri/parser";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(req: NextRequest) {
  await dbConnectionInstance.connectToDB();

  try {
    const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });
    if (!token) {
      return NextResponse.json({
        message: "Log in first",
        statusCode: 404,
        success: false,
      });
    }
    const role = token.role;
    if (role != ADMIN) {
      return NextResponse.json({
        message: "You are not Admin",
        statusCode: 404,
        success: false,
      });
    }

    const { searchParams } = await req.nextUrl;
    const serviceId = searchParams.get("serviceId");
    
    const formData = await req.formData();
    console.log(" Line 35:::FormData:",formData)
    const newName = formData.get("newName") as string;
    const newPrice = formData.get("newPrice") as string;
    const newIsAvailable = formData.get("newIsAvailable") as string;
    const newThumbnail = formData.get("newThumbnail") as File;

    if (!newThumbnail || !(newThumbnail instanceof File)) {
      throw new Error("Thumbnail is required and must be a file");
    }

    let thumbnailURL = "";
    if (newThumbnail) {
      const thumbnailPath = await newThumbnail.arrayBuffer();
      const buffer = Buffer.from(thumbnailPath);
      const parser = new DataURIParser();
      const base64Image = parser.format(
        path.extname(newThumbnail.name).toString(),
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
          resource_type: "auto",
        }
      );
      thumbnailURL = createdImage.secure_url;
    }
    console.log("URL:::::Thumbnail::",thumbnailURL)

    if (!serviceId) {
      return NextResponse.json({
        message: "Service Id missing",
        statusCode: 404,
        success: false,
      });
    }
    const service = await ServiceModel.findById(serviceId);
    if (!service) {
      return NextResponse.json({
        message: "Service not found",
        statusCode: 404,
        success: false,
      });
    }
    service.name = newName || service.name;
    service.price = newPrice || service.price;
    service.isAvailable = Boolean(newIsAvailable) || service.isAvailable;
    if (thumbnailURL) {
      service.thumbnail = thumbnailURL || service.thumbnail;
    }
await service.save();
    return NextResponse.json({
      message: "Succefully edited service details",
      statusCode: 200,
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Something went wrong",
      statusCode: 500,
      success: false,
    });
  }
}
