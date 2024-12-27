import { Availability } from "@/types/models.types";
import mongoose, { Schema } from "mongoose";

const availabilitySchema: Schema<Availability> = new Schema(
    {
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
    //   servicesRequested: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "ServiceRequestModel",
    //     required: false, // Optional, change as needed
    //   },
    },
    { timestamps: true }
  );

export const AvailabilityModel = 
  (mongoose.models.AvailabilityModel as mongoose.Model<Availability>) ||
  mongoose.model<Availability>("AvailabilityModel", availabilitySchema);