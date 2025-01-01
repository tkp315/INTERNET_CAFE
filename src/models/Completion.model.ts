import {
  Completion,
  Payment,
  PaymentStatus,
  PaymentType,
} from "@/types/models.types";
import mongoose, { Schema } from "mongoose";

const completionSchema: Schema<Completion> = new Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequestModel",
      required: true,
    },
    client:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequestModel",
    },
    response_receipt: {
      type: String, //pdf url
    },
    paymentDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentModel",
    },
    paymentStatus:{
      type:String,
      enum:Object.values(PaymentStatus),
      default:PaymentStatus.Unpaid
    }
  },
  { timestamps: true }
);
export const CompletionModel =
  (mongoose.models.CompletionModel as mongoose.Model<Completion>) ||
  mongoose.model<Completion>("CompletionModel", completionSchema);
