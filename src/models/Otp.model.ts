import { Otp } from "@/types/models.types";
import mongoose, { Schema } from "mongoose";

const otpSchema:Schema<Otp> = new Schema({

    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    expiryIn:{
        type:Date,
        default:Date.now,
        expires:20*60,
        required:true
    }

},{timestamps:true})

export const OTPModel = (mongoose.models.OTP as mongoose.Model<Otp>)||(mongoose.model<Otp>("OTP",otpSchema))