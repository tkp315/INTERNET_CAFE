import { PaymentStatus, Status } from "@/types/models.types";
import mongoose, { Schema } from "mongoose";

interface OtherServiceType {
  description: string;
  files?: string[];
  completion: mongoose.Types.ObjectId;
  paymentDetails: mongoose.Types.ObjectId;
  status: Status;
  client: mongoose.Types.ObjectId;
  amount: number;
  response_receipt: string;
  paymentStatus:PaymentStatus
}
const otherServiceSchema: Schema<OtherServiceType> = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    paymentStatus:{
     type:String,
     enum:Object.values(PaymentStatus),
     default:PaymentStatus.Unpaid
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
    },
    response_receipt: {
      type: String,
    },
    files: [String],
    completion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AvailabilityModel",
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.Pending,
    },
    paymentDetails: {
      // keep the name of field 'payment'  otherwise change everyweher
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentModel",
    },
  },
  { timestamps: true }
);

export const OtherService =
  (mongoose.models.OtherService as mongoose.Model<OtherServiceType>) ||
  mongoose.model<OtherServiceType>("OtherService", otherServiceSchema);
