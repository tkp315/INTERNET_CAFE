import { CompletionTable } from "@/app/dashboard/completion/utils/CompletionTable";

import { ADMIN } from "@/lib/constants";
import { CompletionModel } from "@/models/Completion.model";
import { Status } from "@/types/models.types";

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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
  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const requests = await CompletionModel.aggregate([
    {
      $lookup: {
        from: "servicerequestmodels",
        localField: "request",
        foreignField: "_id",
        pipeline: [
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
        ],
        as: "requestDetails",
      },
    },
    {
      $lookup: {
        from: "paymentmodels",
        localField: "payment",
        foreignField: "_id",
        as: "paymentDetails",
      },
    },
    {
      $unwind: {
        path: "$paymentDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
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

  if (!requests || requests.length === 0) {
    return NextResponse.json({
      message: "There are 0 Requests",
      statusCode: 401,
      success: false,
    });
  }

  const serviceRequestData = requests[0];
  // console.log(serviceRequestData.docs[0].requestDetails.serviceDetails)
  const totalDocs = serviceRequestData.metadata[0]?.totalDocs || 0;
  const totalPages = Math.ceil(totalDocs / limit);
  const tableData: CompletionTable[] = serviceRequestData.docs.map((doc) => {
    console.log("Whole Doc",doc)
    const requestDetails = doc.requestDetails[0] || {};
    const serviceDetails = requestDetails.serviceDetails || {};
    const clientDetails = requestDetails.clientDetails || {};
    const paymentDetails = doc.paymentDetails || {};
    

    return {
      serviceId: serviceDetails._id || "N/A", // Service ID
      id: doc._id, // Completion ID
      serviceName: serviceDetails.name || "N/A", // Service Name
      servicePrice: serviceDetails.price || 0, // Service Price
      paymentStatus: doc.paymentStatus || "Unpaid", // Payment Status
      response_reciept: doc.response_receipt || "N/A", // Receipt URL
      clientName: clientDetails.name || "Unknown Client", // Client Name
      clientId: clientDetails._id || "N/A", // Client ID
      clientPhone: clientDetails.phoneNo || "N/A", // Client Phone Number
      // paymentDetails: paymentDetails, // Full Payment Details
       paymentId:  paymentDetails._id||"NA",
        paymentType:  paymentDetails.paymentType||"NA",
        orderId: paymentDetails.orderId||"NA",
        amount:  serviceDetails.price||"NA",
        response_receipt: doc.response_receipt||"NA"
    };
  });
  console.log(tableData)
  return NextResponse.json({
    message: "Successfully fetched all requests",
    statusCode: 200,
    success: true,
    docs: serviceRequestData.docs,
    totalDocs,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    tableData,
  });
}
