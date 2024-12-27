import { ResourceType, uploadOnCloudinary } from "@/lib/cloudinary";
import { ADMIN } from "@/lib/constants";
import { dbConnectionInstance } from "@/lib/db";
import { AvailabilityModel } from "@/models/Availibility.model";
import { OtherService } from "@/models/OtherService.model";
import { Status } from "@/types/models.types";
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
        message: "Authentication required. Please log in to continue.",
        statusCode: 401,
        success: false,
      });
    }

    if (token.role !== ADMIN) {
      return NextResponse.json({
        message: "Access denied. Admins only.",
        statusCode: 403,
        success: false,
      });
    }

    const inputData = await req.formData();
    const serviceDetails = inputData.get("serviceDetails") as string;
    const fileData: File[] = [];
    const date = inputData.get("date") as string;
    const interval = inputData.get("interval") as string;

    if (!serviceDetails) {
      return NextResponse.json({
        message: "Service Description or Files not found",
        statusCode: 403,
        success: false,
      });
    }

    if (!date || !interval) {
      return NextResponse.json({
        message: "Date or Interval not found",
        statusCode: 403,
        success: false,
      });
    }

    inputData.forEach((value, key) => {
      if (value instanceof File) {
        fileData.push(value);
      }
    });
    console.log(fileData);

    const parser = new DataURIParser();
    const fileURLs = await Promise.all(
      fileData.map(async (file) => {
        try {
          const filePath = await file.arrayBuffer();
          const buffer = Buffer.from(filePath);
          const base64FilePath = parser.format(
            path.extname(file.name).toString(),
            buffer
          );

          if (!base64FilePath.content) {
            return NextResponse.json({
              message: "Failed to parse",
              success: false,
              statusCode: 500,
            });
          }
          const uploadFile = await uploadOnCloudinary(
            base64FilePath.content,
            process.env.CLOUDINARY_FOLDER_SRC_REQ!,
             ResourceType.RAW 
          );
          console.log(uploadFile.secure_url);
          return uploadFile.secure_url;
        } catch (error) {
          console.log(error);
        }
      })
    );
    const intervalData = interval.split("-");
    const expectedTime = await AvailabilityModel.create({
      startTime: intervalData[0],
      endTime: intervalData[1],
      date: new Date(date),
    });
    const createRequest = await OtherService.create({
      description: serviceDetails,
      files: fileURLs,
      client: token._id,
      completion:expectedTime._id,
      status:Status.Pending
    });

    return NextResponse.json({
      message: "Successfully created Service",
      statusCode: 200,
      data: createRequest,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Something went wrong",
      statusCode: 500,
      success: false,
      error:
        error instanceof Error
          ? error.message || error.stack
          : "Don't Know the Exact Error",
    });
  }
}
