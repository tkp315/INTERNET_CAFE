import { Role, User } from "@/types/models.types";
import mongoose, { Schema } from "mongoose";


const userSchema:Schema<User> = new Schema({
   name:{
    type:String,
    required:true
   },
   email:{
    type:String,
    required:true,
    lowercase:true
   },
   password:{
    type:String,
   //  required:true
   },
   phoneNo:{
    type:String,
   //  required:true
   },
   role:{
    type:String,
    enum:Object.values(Role),
    default:Role.Client
   },
   isVerified:{
   type:Boolean,
   },
   fcmToken:[
      {
         type:String,
         default:[]
      }
   ],
   profilePic:{
      type:String // cloudinary token
   },
   MyRequestedServices:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"ServiceRequestModel"
   }]
},{timestamps:true})

export const UserModel = (mongoose.models.User as mongoose.Model<User>)||(mongoose.model<User>("User",userSchema))


