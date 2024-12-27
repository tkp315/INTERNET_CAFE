import  { dbConnectionInstance } from "@/lib/db";
import { ServiceModel } from "@/models/Service.model";
import { Category } from "@/models/ServiceCategory.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
interface Query{
    name?:any,
    isAvailable?:boolean,
    category?:mongoose.Types.ObjectId
}
export async function POST (req:NextRequest){
    await dbConnectionInstance.connectToDB();
    try {
        const {searchParams} = req.nextUrl;
        const name = searchParams.get('name');
        const category = searchParams.get('category');
        const isAvailable = searchParams.get('isAvailable')
        const page = parseInt(searchParams.get('page')||'1');
        const limit = parseInt(searchParams.get('limit')||'8');
       
        const query:Query = {};

        
        
        if(name)query.name={$regex:`${name}`,$options:'i'}
        if(isAvailable){
            query.isAvailable= isAvailable==='true'?true:false
        }
        if(category) query.category = new mongoose.Types.ObjectId(category);
       const filteredResult =  await ServiceModel.aggregate([
            {
                $match:query
            },
            {
                $lookup:{
                    from:'categories',
                    foreignField:'_id',
                    localField:'category',
                    as:'categoryDetails'
                }
            },
            {
                $unwind: {
                  path: "$categoryDetails",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $lookup: {
                  from: "formmodels",
                  localField: "Forms",
                  foreignField: "_id",
                  as: "formDetails",
                },
              },
              {
                $lookup: {
                  from: "users",
                  localField: "createdBy",
                  foreignField: "_id",
                  as: "authorDetails",
                },
              },
              {
                $unwind: {
                  path: "$authorDetails",
                  preserveNullAndEmptyArrays: true,
                },
              },
            {$sort:{createdAt:-1}},
            {
                $facet:{
                    metadata:[{$count:'totalDocs'}],
                    docs:[
                        {$skip:(page-1)*limit},
                        {$limit:limit},
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                price: 1,
                                isAvailable: 1,
                                functions: 1,
                                category: "$categoryDetails.name",
                                categoryId: "$categoryDetails._id",
                                createdBy: "$authorDetails.name",
                                forms: "$formDetails",
                                thumbnail: 1,
                                createdAt: 1,
                              },
                        },
                    ],
                },
            },
            {
                $addFields:{
                    "metadata.page":page,
                    "metadata.limit":limit,
                    
                }
            }
    
        ])
        
        const data = filteredResult[0];
    
        const totalDocs = data.metadata[0]?.totalDocs||0;
        const totalPages = Math.ceil(totalDocs / limit);
    
        return NextResponse.json({
            message:'Filtered Result Fetched',
            success:true,
            statusCode:200,
            docs:data.docs,
            totalDocs,
            page,
            limit,
            totalPages,
            hasNextPage: page<totalPages,
            hasPreviousPage:page>1
        })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}