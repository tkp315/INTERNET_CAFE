import { ServiceCategory } from "@/types/models.types";
import mongoose, { Schema } from "mongoose";

const serviceCategorySchema: Schema<ServiceCategory> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      // required: true,
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceModel",
      },
    ],
    isAvailable: {
      type: Boolean,
      default:true
    },
    createdBy:{
        type:  mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
    }
  },
  { timestamps: true }
);

export const ServiceCategoryModel =
  (mongoose.models.Service as mongoose.Model<ServiceCategory>) ||
  mongoose.model<ServiceCategory>("Service", serviceCategorySchema);
