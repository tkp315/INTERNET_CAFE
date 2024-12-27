import  { dbConnectionInstance } from "@/lib/db";
import { FormModel } from "@/models/Form.model";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req:NextRequest){
  try {
    await dbConnectionInstance.connectToDB()
      const token = await getToken({req,secret:process.env.NEXT_AUTH_SECRET});
      
      if(!token){
          return NextResponse.json({
              message:"Log in first",
              statusCode:404,
              success:false
          })
        }
      
      const {selectedFunctions} = await req.json();
      const {searchParams} =  req.nextUrl;
      const page = parseInt(searchParams.get('page')||'1');
      const limit = parseInt(searchParams.get('limit')||'10');

      if (!selectedFunctions || selectedFunctions.length === 0) {
        return NextResponse.json({
          message: "No functions selected",
          statusCode: 400,
          success: false,
        });
      }
      const queryFunctions  = selectedFunctions.filter((e)=>typeof e!=='object');
      console.log(queryFunctions)
      const forms = await FormModel.find({title:{$in:queryFunctions}})
      
      if (forms.length === 0) {
          return NextResponse.json({
            message: "No forms found",
            statusCode: 404,
            success: false,
          });
        }
        
        if (forms.length === 1) {
            const totalPages=Math.ceil(forms[0].FormField.length/limit);
            const start_idx = (page - 1) * limit;
       const end_idx = Math.min(start_idx + limit,forms[0].FormField.length);
        let requiredFields = 0;
        forms[0].FormField.forEach((field)=>{
            if(field.isRequired)requiredFields++;
        })

       const paginatedForms =forms[0].FormField?.slice(start_idx, end_idx);
          return NextResponse.json({
            message: "Filtered Form",
            statusCode: 200,
            success: true,
            data:{
                forms:paginatedForms,
                page,
                limit,
                totalPages,
                hasNextPage: page<totalPages,
                hasPreviousPage:page>1,
                formName:selectedFunctions,
                totalRequiredFields:requiredFields
               
            },
          });
        }
  
        const uniqueFieldMap = new Map();
  
        forms.forEach((form)=>{
          form.FormField.forEach((field)=>{
              if(!uniqueFieldMap.has(field.name)){
                  uniqueFieldMap.set(field.name,field)
              }
          })
        })
  
       const filteredForm = Array.from(uniqueFieldMap.values());
       const totalPages = Math.ceil(filteredForm.length/limit);
       const start_idx = (page - 1) * limit;
       const end_idx = Math.min(start_idx + limit,filteredForm.length);
    
       let requiredFields =0;
       filteredForm.forEach((field)=>{
        if(field.isRequired){
            requiredFields++;
        }
       })
       const paginatedForms =filteredForm?.slice(start_idx, end_idx);
       
       console.log(paginatedForms)
       return NextResponse.json({
          message:'Filtered Form',
          data: {
            forms:paginatedForms,
            page,
            limit,
            totalPages,
            hasNextPage: page<totalPages,
            hasPreviousPage:page>1,
            formName:selectedFunctions,
            totalRequiredFields:requiredFields
          },

          statusCode:200,
          success:true
       })
  } catch (error) {
    return NextResponse.json({
        message:'Something went wrong',
        statusCode:500,
        success:false
     })
  }
}