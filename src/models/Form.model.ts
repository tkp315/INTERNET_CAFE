import { Form } from "@/types/models.types";
import mongoose, { Schema } from "mongoose";

const formData = new Schema({
  type: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  data:{
    type:String,
  },
  isRequired:{
    type:Boolean,
    default:false
  }
  

},{_id:true});
const formSchema: Schema<Form> = new Schema(
  {
    FormField: [formData],
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceModel",
    },
    description:{
      type:String,
    },
    title:{
      type:String,
      required:true
    },
  
  },
  { timestamps: true }
);
export const FormModel =
  (mongoose.models.FormModel as mongoose.Model<Form>) ||
  mongoose.model<Form>("FormModel", formSchema);
