import { ADMIN } from "@/lib/constants";
import  { dbConnectionInstance } from "@/lib/db";
import { FormModel } from "@/models/Form.model";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnectionInstance.connectToDB();

  try {
    // Get the token for authentication
    const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });
    if (!token) {
      return NextResponse.json({
        message: "Log in first",
        statusCode: 401,
        success: false,
      });
    }

    // Check if the user is an admin
    const role = token.role;
    if (role !== ADMIN) {
      return NextResponse.json({
        message: "You are not authorized to perform this action",
        statusCode: 403,
        success: false,
      });
    }

    // Parse request body
    const {searchParams}= req.nextUrl;
    const formId = searchParams.get('formId')
    const {
      name,
      label,
      type,
      insideFormId,
    } = await req.json();

    // Validate `formId`
    if (!formId) {
      return NextResponse.json({
        message: "Form ID is missing",
        statusCode: 400,
        success: false,
      });
    }

    // Fetch the form document by `formId`
    const form = await FormModel.findById(formId);
    if (!form) {
      return NextResponse.json({
        message: "Form not found",
        statusCode: 404,
        success: false,
      });
    }

    // Find the specific subdocument by `insideFormId`

    const insideForm =form.FormField.find((e)=>e._id.toString()===insideFormId);

    if (!insideForm) {
      return NextResponse.json({
        message: "Form field not found",
        statusCode: 404,
        success: false,
      });
    }

    // Update the fields if provided
    insideForm.name = name || insideForm.name;
    insideForm.label = label || insideForm.label;
    insideForm.type = type || insideForm.type;

    await form.save();

    return NextResponse.json({
      message: "Successfully updated the form field",
      statusCode: 200,
      success: true,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({
      message: "Something went wrong",
      statusCode: 500,
      success: false,
    });
  }
}
