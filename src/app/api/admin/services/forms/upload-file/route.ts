import { NextRequest, NextResponse } from "next/server";
import csvParser from "csv-parser";
import { Readable } from "stream"; // Import to create a readable stream from the buffer
import  { dbConnectionInstance } from "@/lib/db";
import { FormModel } from "@/models/Form.model";

export async function POST(req: NextRequest) {
  await dbConnectionInstance.connectToDB();

  try {
    const data = await req.formData();
    const csv_file = data.get("csv_file") as File;
    const { searchParams } = req.nextUrl;
    const formId = searchParams.get("formId");

    if (!csv_file) {
      return NextResponse.json({
        message: "No file uploaded",
        statusCode: 404,
        success: false,
      });
    }

    if (!formId) {
      return NextResponse.json({
        message: "Form ID is required",
        statusCode: 400,
        success: false,
      });
    }

    // Convert CSV file to buffer and create a readable stream
    const fileBuffer = await csv_file.arrayBuffer();
    const readableStream = Readable.from(Buffer.from(fileBuffer));

    // Parse CSV and gather form field data
    const results: { name: string; label: string; type: string ,data?:string}[] = [];

    await new Promise((resolve, reject) => {
      readableStream
        .pipe(csvParser())
        .on("data", (row) => {
            let data;
            if(row.type==='select'.toLowerCase()){
                data=row.data
            }
          const fieldData = {
            name: row.name,
            label: row.label,
            type: row.type,
            data
          };
          results.push(fieldData);
        })
        .on("end", resolve)
        .on("error", reject);
    });

    // Fetch the form document
    const form = await FormModel.findById(formId);
    if (!form) {
      return NextResponse.json({
        message: "Form not found",
        statusCode: 404,
        success: false,
      });
    }

    // Update the form's FormField array
    form.FormField = [...form.FormField, ...results];
    await form.save();

    return NextResponse.json({
      message: "Successfully inserted form fields",
      success: true,
      statusCode: 200,
      data: { formFields: form.FormField },
    });
  } catch (error) {
    console.error("Error during CSV processing:", error);
    return NextResponse.json({
      error: "Error processing file",
      statusCode: 500,
      success: false,
      data: error.message || "An unknown error occurred",
    });
  }
}
