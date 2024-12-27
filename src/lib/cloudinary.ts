import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { CLOUDINARY_MAX_RETRIES, CLOUDINARY_RETRY_INTERVAL } from "./constants";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,  // Ensure URLs are HTTPS
});

export enum ResourceType {
  AUTO='auto',
  IMAGE='image',
  RAW = 'raw',
  VIDEO='video'
}


const uploadOnCloudinary = async function (localFilePath:string,folderName:string,resource_type:ResourceType,retries:number=0) {
  try {
 
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: folderName,
      secure: true,
      resource_type: resource_type,  
    });

    return response;
  } catch (error) {
   if(retries<CLOUDINARY_MAX_RETRIES){
    await new Promise(resolve=>setTimeout(resolve,CLOUDINARY_RETRY_INTERVAL))
    return uploadOnCloudinary(localFilePath,folderName,resource_type,retries+1)
   }
   else{
    throw new Error("cloudinary upload failed after multiple tries")
   }
  }
};

export { uploadOnCloudinary };


export { cloudinary };