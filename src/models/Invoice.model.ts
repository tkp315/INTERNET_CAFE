import { Invoice } from "@/types/models.types";
import mongoose, { Schema } from "mongoose";

const invoiceSchema:Schema<Invoice> = new Schema({
    client:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    invoiceNumber:{
        type:String
    },
    serviceRequest:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "ServiceRequest",
        required:true
    },
    pdfUrl:{
        type:String,
        required:true
    },
    issuedAt:{
        type:Date,
        required:true,
        default:Date.now
    }
    
},{timestamps:true})

export const InvoiceModel = (mongoose.models.InvoiceModel as mongoose.Model<Notification>)||(mongoose.model<Notification>("InvoiceModel",invoiceSchema))