import { NextRequest, NextResponse } from "next/server";
import { dbConnectionInstance } from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { Category } from "@/models/ServiceCategory.model";
import { CategoryType } from "@/app/schemas/categoryTableSchema";
import { ADMIN } from "@/lib/constants";

interface Query {
  name?: string;
  isAvailable?: boolean;
  createdAt?: Date;
}

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

    if (token.role !== ADMIN) {
      return NextResponse.json({
        message: "Access denied. Admins only.",
        statusCode: 403,
        success: false,
      });
    }

    const { searchParams } = req.nextUrl;
    const dateInterval = searchParams.get("dateInterval");
    const categoryName = searchParams.get("categoryName");
    const availability = searchParams.get("availability");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const query: Query = {};

    if (categoryName) query.name = categoryName;
    if (availability) query.isAvailable = availability === "true";

    const categories = await Category.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "createdBy",
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
          ],
          as: "createdBy",
        },
      },
      {
        $unwind: {
          path: "$createdBy",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "servicemodels",
          foreignField: "_id",
          localField: "services",
          as: "services",
        },
      },
      {
        $facet: {
          metadata: [{ $count: "totalDocs" }],
          docs: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ]);

    if (!categories || categories.length === 0) {
      return NextResponse.json({
        message: "Fetching categories failed",
        statusCode: 404,
        success: false,
      });
    }

    const data = categories[0];
    const totalDocs = data.metadata[0]?.totalDocs || 0;
    const totalPages = Math.ceil(totalDocs / limit);

    const tableData: CategoryType[] = data.docs.map((cat) => ({
      name: cat.name,
      services: cat.services.length || 0,
      isAvailable: cat.isAvailable,
      updatedAt: new Date(cat.createdAt).toDateString(),
      createdBy: cat.createdBy?.name || "Unknown",
      description: cat.description || "",
      _id: String(cat._id),
    }));

    return NextResponse.json({
      message: "Successfully fetched all Categories",
      statusCode: 200,
      success: true,
      data: {
        categories: data.docs,
        tableData,
        paginationParameters: {
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          limit,
          page,
          totalPages,
          totalDocs,
        },
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : "Unknown error",
      success: false,
      statusCode: 500,
    });
  }
}
