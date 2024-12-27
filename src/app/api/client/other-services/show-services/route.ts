import { dbConnectionInstance } from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { OtherService } from "@/models/OtherService.model";
import mongoose from "mongoose";
import { OrderFilteration } from "@/app/redux/slices/filteration.slice";
import { PaymentStatus } from "@/types/models.types";

export async function GET(req: NextRequest) {
  await dbConnectionInstance.connectToDB();

  try {
    const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });

    if (!token) {
      return NextResponse.json({
        message: "Log In First",
        statusCode: 401,
        success: false,
      });
    }
    const query: any = {
      client: new mongoose.Types.ObjectId(token._id), // Always match the client
    };
    const filters: any[] = [];
    query.client = new mongoose.Types.ObjectId(token._id);
    const limit = 10;
    const { searchParams } = req.nextUrl;
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const completed = searchParams.get("completed");
    const ongoing = searchParams.get("ongoing");
    const paid = searchParams.get("paid");
    const pending = searchParams.get("pending");
    const unpaid = searchParams.get("unpaid");
    const skip = limit * (page - 1);
    console.log(pending)
    //    **********payment status *******************

    if (paid === "true" && unpaid === "false") filters.push({ paymentStatus: PaymentStatus.Paid });
    if (paid === "false" && unpaid === "true") filters.push({ paymentStatus: PaymentStatus.Unpaid  });
   

    // ******************status***********
    if (completed === "true") filters.push({ completed: true });
    if (ongoing === "true") filters.push({ ongoing: true });
    if (pending === "true") filters.push({ pending: true });

    if (search!=='') {
      filters.push({ description: { $regex: search, $options: "i" } });
    }

    if (filters.length > 0) {
      query.$or = filters;
    }
   console.log(`[Query Object]`,query)
    const customRequest = await OtherService.aggregate([
      {
        $match:query,
      },
      {
        $lookup: {
          from: "users",
          localField: "client",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                name: 1,
                phoneNo: 1,
                email: 1,
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
        $lookup: {
          from: "paymentmodels",
          localField: "paymentDetails",
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
    if (!customRequest || customRequest.length === 0) {
        return NextResponse.json({
          message: "No custom requests found",
          statusCode: 401,
          success: false,
        });
      }
    const otherServiceRequestsDetails = customRequest[0];
    const totalDocs = otherServiceRequestsDetails.metadata[0]?.totalDocs || 0;
    const totalPages = Math.ceil(totalDocs / limit);
   

    const paginationData = {
      totalPages,
      totalDocs,
      page,
      limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return NextResponse.json({
      message: "Successfully fetched Custom requests",
      success: true,
      statusCode: 200,
      data: {
        paginationData,
        otherServiceRequestsDetails,
      },
    });
  } catch (error) {
    console.error("Error fetching custom services:", error);

    return NextResponse.json({
        error : error instanceof Error ? error.message||error.stack:"Don't know exact error",
      message: "Something went wrong",
      statusCode: 500,
      success: false,
    });
  }
}
