import { Notification } from "@/types/models.types";
import mongoose, { Schema } from "mongoose";

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
        required:true
    },
    isRead:{
        type:Boolean,
        required:true
    }
    
},{timestamps:true})

export const NotificationModel = (mongoose.models.NotificationModel as mongoose.Model<Notification>)||(mongoose.model<Notification>("NotificationModel",notificationSchema))