import { NextRequest, NextResponse } from "next/server";
import csvParser from "csv-parser";
import { ServiceModel } from "@/models/Service.model";
import { Category } from "@/models/ServiceCategory.model";
import { Readable } from "stream"; // Import to create a readable stream from the buffer
import  { dbConnectionInstance } from "@/lib/db";
import { ADMIN } from "@/lib/constants";
import { getToken } from "next-auth/jwt";

interface Result{
  category:string,
  name:string,
  price:string,
  functions:string[],
  isAvailable:boolean,
  createdBy:string,
  createdAt:string
}

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
    
    const data = await req.formData();
    const csv_file = data.get("csv_file") as File;

    if (!csv_file) {
      return NextResponse.json({
        message: "No File uploaded",
        statusCode: 404,
        success: false,
      });
    }

    // Convert CSV file to buffer and create a readable stream
    const fileBuffer = await csv_file.arrayBuffer();
    const readableStream = Readable.from(Buffer.from(fileBuffer));

    // Wrap CSV parsing and database operations in a Promise
    const results:Result[] = [];
    let category = "";


    const response = await new Promise((resolve, reject) => {
      readableStream
        .pipe(csvParser())
        .on("data", (data) => {
          category = data.category;
          const serviceData:Result = {
            name: data.name,
            price: data.price?data.price:"0",
            category: data.category,
            functions: data.functions?.split(",").map((fun:string) => fun.trim()),
            isAvailable: data.isAvailable === "true",
            createdBy: data.createdBy,
            createdAt:data.createdAt
          };
          results.push(serviceData);
        })
        .on("end", async () => {
          try {
            // Insert services and update category
            const services = await ServiceModel.insertMany(results);
            const serviceIds = services.map((service) => service._id);
            if (category) {
              await Category.findByIdAndUpdate(category, {
                $addToSet: {
                  services: {
                    $each: serviceIds,
                  },
                },
              });
            }

            resolve(
              NextResponse.json({
                message: "Successfully inserted Services",
                success: true,
                statusCode: 200,
                data: { services },
              })
            );
          } catch (error) {
            console.error("Error inserting services:", error);
            reject(
              NextResponse.json({
                error: "Error inserting services",
                statusCode: 500,
                success: false,
              })
            );
          }
        })
        .on("error", (error) => {
          console.error("Error parsing CSV:", error);
          reject(
            NextResponse.json({
              error: "Error parsing CSV file",
              statusCode: 500,
              success: false,
            })
          );
        });
    });

    return response;

  } catch (error) {
    console.error("Error during CSV processing:", error);
    return NextResponse.json({
      error: "Error processing file",
      statusCode: 500,
      success: false,
      data: error,
    });
  }
}
