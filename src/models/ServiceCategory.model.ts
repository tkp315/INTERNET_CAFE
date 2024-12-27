import { ServiceCategory } from "@/types/models.types";
import mongoose, { Schema } from "mongoose";
import { serviceSchema } from "./Service.model";

export const serviceCategorySchema: Schema<ServiceCategory> = new Schema(
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
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:"ServiceModel"
      },
    ],
    isAvailable: {
      type: Boolean,
      default:true
    },
    createdBy:{
        type:  mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
  },
  { timestamps: true }
);

export const Category =
  (mongoose.models.Category as mongoose.Model<ServiceCategory>) ||
  mongoose.model<ServiceCategory>("Category", serviceCategorySchema);
