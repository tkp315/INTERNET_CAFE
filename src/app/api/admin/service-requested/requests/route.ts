import { ServiceRequestTable } from "@/app/dashboard/service-request/utils/requestTablseSchema";
import { ADMIN } from "@/lib/constants";
import { dbConnectionInstance } from "@/lib/db";
import { ServiceRequestModel } from "@/models/ServiceRequest.Model";
import { Status } from "@/types/models.types";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await dbConnectionInstance.connectToDB();

  try {
    const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });
    if (!token) {
      return NextResponse.json({
        message: "Log in First",
        statusCode: 401,
        success: false,
      });
    }

    if (token.role !== ADMIN) {
      return NextResponse.json({
        message: "You are not Admin",
        statusCode: 401,
        success: false,
      });
    }
    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    console.log(`[page]::`, page);
    // const services = await ServiceRequestModel.aggregate([
    //   // {
    //   //   $match: { status: { $ne: Status.Completed } }
    //   // },

    //   {
    //     $lookup: {
    //       from: "servicemodels",
    //       foreignField: "_id",
    //       localField: "service",
    //       pipeline: [
    //         {
    //           $project: {
    //             name: 1,
    //             thumbnail: 1,
    //             price: 1,
    //             _id:1,
    //           },
    //         },
    //       ],
    //       as: "serviceDetails",
    //     },
    //   },
    //   {
    //     $unwind:{
    //       path:'$serviceDetails',
    //       preserveNullAndEmptyArrays:true
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       foreignField: "_id",
    //       localField: "client",
    //       pipeline: [
    //         {
    //           $project: {
    //             name: { $ifNull: ["$name", "Unknown Client"] }, // Default to "Unknown Client"
    //             email: { $ifNull: ["$email", "N/A"] },
    //             phoneNo: { $ifNull: ["$phoneNo", "N/A"] },
    //           },
    //         },
    //       ],
    //       as: "clientDetails",
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$clientDetails",
    //       preserveNullAndEmptyArrays: true,
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "availabilitymodels",
    //       foreignField: "_id",
    //       localField: "completion",
    //       as: "completionDetails",
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$completionDetails",
    //       preserveNullAndEmptyArrays: true,
    //     },
    //   },

    //   { $sort: { createdAt: -1 } },
    //   {
    //     $facet: {
    //       metadata: [{ $count: "totalDocs" }],
    //       docs: [
    //         {
    //           $skip: skip,
    //         },
    //         { $limit: limit },
    //       ],
    //     },
    //   },
    //   {
    //     $addFields: {
    //       "metadata.page": page,
    //       "metadata.limit": limit,
    //     },
    //   },
    // ]);

    // const services = await ServiceRequestModel.aggregate([
    //   {
    //        $match: { status: { $ne: Status.Completed } }
    // },
    //   {
    //     $lookup: {
    //       from: "servicemodels",
    //       localField: "service",
    //       foreignField: "_id",
    //       // pipeline: [
    //       //   {
    //       //     $project: {
    //       //       name: { $ifNull: ["$name", "N/A"] }, // Default to "N/A" if name is missing
    //       //       thumbnail: { $ifNull: ["$thumbnail", null] },
    //       //       price: { $ifNull: ["$price", 0] },
    //       //       _id: 1,
    //       //     },
    //       //   },
    //       // ],
    //       as: "serviceDetails",
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$serviceDetails",
    //       preserveNullAndEmptyArrays: true,
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "client",
    //       foreignField: "_id",
    //       // pipeline: [
    //       //   {
    //       //     $project: {
    //       //       name: { $ifNull: ["$name", "Unknown Client"] }, // Default to "Unknown Client"
    //       //       email: { $ifNull: ["$email", "N/A"] },
    //       //       phoneNo: { $ifNull: ["$phoneNo", "N/A"] },
    //       //     },
    //       //   },
    //       // ],
    //       as: "clientDetails",
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$clientDetails",
    //       preserveNullAndEmptyArrays: true,
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "availabilitymodels",
    //       localField: "completion",
    //       foreignField: "_id",
    //       as: "completionDetails",
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$completionDetails",
    //       preserveNullAndEmptyArrays: true,
    //     },
    //   },
    //   {
    //     $sort: { createdAt: -1 },
    //   },
    //   {
    //     $facet: {
    //       metadata: [{ $count: "totalDocs" }],
    //       docs: [
    //         {
    //           $skip: skip,
    //         },
    //         { $limit: limit },
    //       ],
    //     },
    //   },
    //   {
    //     $addFields: {
    //       "metadata.page": page,
    //       "metadata.limit": limit,
    //     },
    //   },
    // ]);
    const services = await ServiceRequestModel.aggregate([
      { $match: { status: { $ne: Status.Completed } } },
         {
        $lookup: {
          from: "servicemodels",
          localField: "service",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                name: { $ifNull: ["$name", "N/A"] }, // Default to "N/A" if name is missing
                thumbnail: { $ifNull: ["$thumbnail", null] },
                price: { $ifNull: ["$price", 0] },
                _id: 1,
              },
            },
          ],
          as: "serviceDetails",
        },
      },
      {
        $unwind: {
          path: "$serviceDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
  {
        $lookup: {
          from: "users",
          localField: "client",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                name: { $ifNull: ["$name", "Unknown Client"] }, // Default to "Unknown Client"
                email: { $ifNull: ["$email", "N/A"] },
                phoneNo: { $ifNull: ["$phoneNo", "N/A"] },
              },
            },
          ],
          as: "clientDetails",
        },
      },
      {
        $unwind: {
          path: "$clientDetails",
          preserveNullAndEmptyArrays: true,
        },
      },

   {
        $lookup: {
          from: "availabilitymodels",
          localField: "completion",
          foreignField: "_id",
          as: "completionDetails",
        },
      },
      {
        $unwind: {
          path: "$completionDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
         {
        $sort: { createdAt: -1 },
      },
      {
        $facet: {
          metadata: [{ $count: "totalDocs" }],
          docs: [
            {
              $skip: skip,
            },
            { $limit: limit },
          ],
        },
      },
      {
        $addFields: {
          "metadata.page": page,
          "metadata.limit": limit,
        },
      },
    ]);

    if (!services || services.length === 0) {
      return NextResponse.json({
        message: "There are 0 Requests",
        statusCode: 401,
        success: false,
      });
    }

    const data = services[0];
    const totalDocs = data.metadata[0]?.totalDocs || 0;
    const totalPages = Math.ceil(totalDocs / limit);

    const tableData: ServiceRequestTable[] = data.docs.map((doc) => {
      const serviceDetails=doc.serviceDetails;
      const clientDetails = doc.clientDetails;
      const timing = doc.completionDetails;
     

      return {
        id: doc._id,


        serviceName: doc.serviceDetails.name||'Unknown',
        serviceId: doc.serviceDetails._id||'1',
        servicePrice: doc.serviceDetails.price||'0',

        clientId: doc.clientDetails._id,
        clientName: doc.clientDetails.name,
        clientEmail: doc.clientDetails.email,
        clientPhone: doc.clientDetails.phoneNo,

        requestedFunctions: doc.requestedFunction,

        interval:`${doc.completionDetails.startTime}-${doc.completionDetails.endTime}`,
        date:doc.completionDetails.date,
        status: doc.status,
        formLink: doc.formDetails,
        completion: doc.completion,
        createdAt:doc.createdAt
      };
    });
  
    return NextResponse.json({
      message: "Successfully fetched all requests",
      statusCode: 200,
      success: true,
      docs: data.docs,
     

      totalDocs,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      tableData
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Something went wrong",
      success: false,
      statusCode: 500,
      error:
        error instanceof Error ? error.message || error.stack : "Error Message",
    });
  }
}
