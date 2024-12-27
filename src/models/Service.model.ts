import {  ServiceSchema } from "@/types/models.types";
import mongoose, { Schema } from "mongoose";




export const serviceSchema:Schema<ServiceSchema> = new Schema({
  name:{
    type:String,
    required:true
  },
  price:{
    type:String,
    required:true
  },
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Category",
    required:true
  },

  functions:[
   String
  ],

  thumbnail:{
    type:String,
    required:false
  },
  Forms:[
  {
    type:mongoose.Schema.Types.ObjectId,
    ref:"FormModel",
  }
  ]
 ,
  isAvailable:{
    type:Boolean,
    required:true
  },
  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  }
  

},{timestamps:true})

export const ServiceModel = (mongoose.models.ServiceModel as mongoose.Model<ServiceSchema>)||(mongoose.model<ServiceSchema>("ServiceModel",serviceSchema))