import { PaymentStatus, ServiceRequest, Status } from "@/types/models.types";
import mongoose, { Schema } from "mongoose";

const ServiceRequestSchema:Schema<ServiceRequest> = new Schema({
    service:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ServiceModel",
        required:true
    },
    requestedFunction:[String],
    client:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    formDetails:{
        type:String, // url of pdf
    },
    completion:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"AvailabilityModel", 
    },
    status:{
        type:String,
        enum:Object.values(Status),
        default:Status.Pending,
    },
    description:{
        type:String,
        required:true
    },
    messages:[{
        type:String,
    }],
    paymentStatus:{
        type:String,
        enum:Object.values(PaymentStatus),
        default:PaymentStatus.Unpaid
    },
    payment:{  // keep the name of field 'payment'  otherwise change everyweher
        type:mongoose.Schema.Types.ObjectId,
        ref:"PaymentModel"
    },
    taskCompletion:{
                type:mongoose.Schema.Types.ObjectId,
        ref:"CompletionModel"
    }
    // one more admin response model where completed on and other things 
},{timestamps:true})

export const ServiceRequestModel = (mongoose.models.ServiceRequestModel as mongoose.Model<ServiceRequest>)||(mongoose.model<ServiceRequest>("ServiceRequestModel",ServiceRequestSchema))