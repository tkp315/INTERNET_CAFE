import { ServiceRequest, Status } from "@/types/models.types";
import mongoose, { Schema } from "mongoose";

const ServiceRequestSchema:Schema<ServiceRequest> = new Schema({
    service:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Service",
        required:true
    },
    client:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    formDetails:{
        type:String,
    },
    completion:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Availability",
    },
    status:{
        type:String,
        enum:Object.values(Status),
        default:Status.Pending,
    },
    description:{
        type:String,
        required:true
    }
},{timestamps:true})

export const ServiceRequestModel = (mongoose.models.ServiceRequest as mongoose.Model<ServiceRequest>)||(mongoose.model<ServiceRequest>("ServiceRequest",ServiceRequestSchema))