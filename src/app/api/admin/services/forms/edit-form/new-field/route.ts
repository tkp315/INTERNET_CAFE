import { FormField } from "@/components/ui/form";
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

   
    const {searchParams}= req.nextUrl;
    const formId = searchParams.get('formId')
    const formData = await req.formData();
    const fieldObj = formData.get('fieldObj')as string;
    const parsedFieldObj=JSON.parse(fieldObj);
    
   console.log(formData)
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

   
   console.log(parsedFieldObj)

  //  if(parsedFieldObj.type==='select' && parsedFieldObj.data){
  //   parsedFieldObj.data= parsedFieldObj.data.split('|');

  //  }
  
    form.FormField.push(parsedFieldObj);
    await form.save().catch((err) => console.error("Mongoose Save Error:", err));
    

    return NextResponse.json({
      message: "Successfully Added a Field in  the form",
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
