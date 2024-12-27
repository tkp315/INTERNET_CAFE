import { Notification } from "@/types/models.types";
import mongoose, { mongo, Schema } from "mongoose";

const notificationSchema:Schema<Notification> = new Schema({
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    message:{
        type:String
    },
    serviceRequest:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "ServiceRequest",
    },
    customRequest:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"OtherService"
    },
    isRead:{
        type:Boolean,
        required:true,
        default:false
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    }
    
},{timestamps:true})

export const NotificationModel = (mongoose.models.NotificationModel as mongoose.Model<Notification>)||(mongoose.model<Notification>("NotificationModel",notificationSchema))