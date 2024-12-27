import { Payment, PaymentStatus, PaymentType } from "@/types/models.types";
import mongoose, { Schema } from "mongoose";

const paymentSchema: Schema<Payment> = new Schema(
  {
    serviceRequested: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequestModel",
      required: true,
    },
    paymentType: {
      type: String,
      enum: Object.values(PaymentType),
      default: PaymentType.Cash,
    },
    orderId: {
      type: String, // razorpay
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.Pending,
    },
    customRequest:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "OtherService",
    }
  },
  { timestamps: true }
);

export const PaymentModel =
  (mongoose.models.PaymentModel as mongoose.Model<Payment>) ||
  mongoose.model<Payment>("PaymentModel",paymentSchema);
