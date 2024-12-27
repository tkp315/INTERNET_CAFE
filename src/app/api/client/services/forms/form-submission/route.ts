import { cloudinary, ResourceType, uploadOnCloudinary } from "@/lib/cloudinary";
import  { dbConnectionInstance } from "@/lib/db";
import DataURIParser from "datauri/parser";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

interface FileType {
  key: string;
  val: File;
}
interface DataType {
  key: string;
  val: any;
}
export async function POST(req: NextRequest) {
  try {
    await dbConnectionInstance.connectToDB();
    const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });
   
    if (!token) {
      return NextResponse.json({
        message: "Log in first",
        statusCode: 404,
        success: false,
      });
    }


    const formData = await req.formData();
    const fileData: FileType[] = [];
    const inputData: DataType[] = [];

    formData.forEach((value, key) => {
      if (value instanceof File) {
        fileData.push({ key, val: value });
      } else {
        inputData.push({ key, val: value });
      }
    });
    const parser = new DataURIParser();
    const fileURLs = await Promise.all(
      fileData.map(async (file) => {
        try {
          const filePath = await file.val.arrayBuffer();
          const buffer = Buffer.from(filePath);
          const base64FilePath = parser.format(
            path.extname(file.val.name).toString(),
            buffer
          );

          if (!base64FilePath.content) {
            return NextResponse.json({
              message: "Failed to parse",
              success: false,
              statusCode: 500,
            });
          }
          const uploadFile = await uploadOnCloudinary(base64FilePath.content,process.env.CLOUDINARY_FOLDER_DOCUMENTS!,ResourceType.RAW||'raw');
          
          //   console.log(file.val.name,`:`,uploadFile?.secure_url);
          return { name: file.key, url: uploadFile?.secure_url };
        } catch (error) {
          console.log(error);
        }
      })
    );
    
    const clientFormDetails = {urls:fileURLs,jsonData:inputData};
    return NextResponse.json({
      message: "Succeffuly submitted form",
      statusCode: 200,
      success: true,
      data:clientFormDetails
    });
  } catch (error) {
    return NextResponse.json({
      message: "Something went wrong",
      statusCode: 500,
      success: false,
    });
  }
}
