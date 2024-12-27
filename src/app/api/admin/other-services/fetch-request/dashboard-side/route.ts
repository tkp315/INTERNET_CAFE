import { CustomeServiceTable } from "@/app/dashboard/custom-services/utils/custom-service-table";
import { ADMIN } from "@/lib/constants";
import { dbConnectionInstance } from "@/lib/db";
import { OtherService } from "@/models/OtherService.model";
import { Status } from "@/types/models.types";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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
    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    

    const otherServiceRequests = await OtherService.aggregate([
      {
        $lookup: {
          from:'users',
          localField:'client',
          foreignField:'_id',
          pipeline:[
              {
                $project:{
                  name:1,
                  phoneNo:1,
                  email:1,
                }
              }
          ],
          as:'clientDetails'
        },
      },
      { $unwind: {
        path:'$clientDetails',
        preserveNullAndEmptyArrays:true
      } },

      {
        $lookup: {
          from:'availabilitymodels',
          localField:'completion',
          foreignField:'_id',
          as:'completionDetails'
        },
      },
      { $unwind: {
        path:'$completionDetails',
        preserveNullAndEmptyArrays:true
      } },

      {
        $lookup: {
          from:'paymentmodels',
          localField:'paymentDetails',
          foreignField:'_id',
          as:'paymentDetails'
        },
      },
      { $unwind: {
        path:'$paymentDetails',
        preserveNullAndEmptyArrays:true
      } },
      {
        $facet: {
          metadata: [{ $count: "totalDocs" }],
          docs: [{ $skip: skip }, { $limit: limit }],
        },
      },
      {
        $addFields: {
          "metadata.page": page,
          "metadata.limit": limit,
        },
      },

    ]);
    const yes = await OtherService.find({});
    console.log(yes.length);
 
    if(!otherServiceRequests){
      return NextResponse.json({
        message:"Service request not found",
        statusCode:404,
        success:false
      })
    }
    console.log(`[aggregate length::100]`,otherServiceRequests[0].docs.length);

    const otherServiceRequestsDetails =otherServiceRequests[0] ;
    const totalDocs = otherServiceRequestsDetails.metadata[0]?.totalDocs || 0;
    const totalPages = Math.ceil(totalDocs / limit);

    // table data
    const tableData: CustomeServiceTable[] = otherServiceRequestsDetails.docs.map(
      (data) => {
        const timingDetails = data.completionDetails || {};
        const clientDetails = data.clientDetails || {};
        const paymentDetails = data.paymentDetails || {};
    
        return {
          id: data._id || "NA",
          name: data.description || "NA",
          files: data.files || [],
          interval: timingDetails.startTime && timingDetails.endTime
            ? `${timingDetails.startTime}-${timingDetails.endTime}`
            : "NA",
          date: timingDetails.date || "NA",
          completionId: timingDetails._id || "NA",
          status: data.status || "Pending",
          clientName: clientDetails.name || "Unknown",
          clientPhone: clientDetails.phoneNo || "NA",
          clientEmail: clientDetails.email || "NA",
          clientId: clientDetails._id || "NA",
          paymentId: paymentDetails._id || "NA",
          paymentStatus: paymentDetails.paymentStatus || "NA",
          paymentType: paymentDetails.paymentType || "NA",
          orderId: paymentDetails.orderId || "NA",
          amount: data.amount || 0,
          response_receipt: data.response_receipt || "NA",
          createdAt: data.createdAt || new Date().toISOString(),
        };
      }
    );
    console.log("[custom service data]",otherServiceRequests.docs)

    const paginationData = {
      totalPages,
      totalDocs,
      page,
      limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
    return NextResponse.json({
      message: "Successfully created Service",
      statusCode: 200,
      data: {
        otherServiceRequestsDetails ,
        paginationData,
        tableData,
      },

      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Something went wrong",
      statusCode: 500,
      error:
        error instanceof Error
          ? error.message || error.stack
          : "Unable to find Error",

      success: true,
    });
  }
}
