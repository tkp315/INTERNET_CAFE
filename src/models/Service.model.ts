import { Service } from "@/types/models.types";
import mongoose, { Schema } from "mongoose";


const serviceSchema:Schema<Service> = new Schema({
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

  functions:[{type:String,required:true}],

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
    type:Boolean
  },
  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"UserModel",
  }

},)

export const ServiceModel = (mongoose.models.ServiceModel as mongoose.Model<Service>)||(mongoose.model<Service>("ServiceModel",serviceSchema))