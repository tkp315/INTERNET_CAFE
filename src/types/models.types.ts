import mongoose, { Document } from "mongoose";
export enum Role {
  Client = "Client",
  Admin = "Admin",
}
interface FormFields {
  type: string;
  label: string;
  name: string;
}
export enum Status {
  Pending = "Pending",
  Ongoing = "Ongoing",
  Completed = "Completed",
}
export enum PaymentType{
  Cash='Cash',
  Online= 'Online'
}
export enum PaymentStatus {
  Paid= "Paid",
  Unpaid="Unpaid",
  Pending="Pending",

}
export interface User extends Document {
  name: string;
  email: string;
  password: string;
  phoneNo: string;
  role: Role;
  isVerified: boolean;
  fcmToken:string[];
  profilePic:string;
  MyRequestedServices: Array<mongoose.Types.ObjectId>; // service requested
}
export interface Otp extends Document {
  email: string;
  otp: string;
  expiryIn: Date;
}
export interface Function extends Document{
  title:string,
}
export interface ServiceSchema extends Document {
  name: string;
  price: string;
  category: mongoose.Types.ObjectId;
  subCategory: mongoose.Types.ObjectId;
  isAvailable: boolean;
  createdBy: mongoose.Types.ObjectId;
  thumbnail: string;
  functions: Array<String>;
  Forms:Array<mongoose.Types.ObjectId>
}

export interface FormFieldItem {
    name: string;
    type: string;
    label: string;
    data?:string;
  isRequired:boolean;

   
}
export interface Form extends Document {
   FormField:Array<FormFieldItem>;
  service:mongoose.Types.ObjectId;
  title:string,
  description:string,
}

export interface ServiceRequest extends Document {
  service: mongoose.Types.ObjectId; // services
  taskCompletion:mongoose.Types.ObjectId;
  client: mongoose.Types.ObjectId; //user
  formDetails: string; // file url (pdf url)
  completion: mongoose.Types.ObjectId;
  paymentStatus:PaymentStatus
  status: Status;
  description?: string;
  requestedFunction:string[]
  messages:string[],
  payment:mongoose.Types.ObjectId
}
export interface ServiceCategory extends Document {
  name: string;
  description: string;
  createdAt: Date;
  services: Array<mongoose.Types.ObjectId>;
  isAvailable: boolean;
  createdBy: mongoose.Types.ObjectId;
}

export interface Notification extends Document {
  recipient: mongoose.Types.ObjectId;
  message: string; // message
  serviceRequest: mongoose.Types.ObjectId; // to get only id
  isRead: boolean;
  sender:mongoose.Types.ObjectId;
  customRequest:mongoose.Types.ObjectId
}

export interface Invoice extends Document {
  client: mongoose.Types.ObjectId;
  serviceRequest: mongoose.Types.ObjectId; // to get only id
  invoiceNumber: string; // unique
  pdfUrl: string;
  issuedAt: Date;
}

export interface Payment extends Document {
  client: mongoose.Types.ObjectId;
  amount: number;
  serviceRequested: mongoose.Types.ObjectId;
  orderId: string; // rozarpay
  status: PaymentStatus;
  paymentType:PaymentType,
  customRequest:mongoose.Types.ObjectId;
}
export interface Completion extends Document{
   request:mongoose.Types.ObjectId,
   paymentDetails:mongoose.Types.ObjectId,
   response_receipt:string ;
   paymentStatus:PaymentStatus,
   client:mongoose.Types.ObjectId// url of pdf make a dialog for uploading receipt / any kind or response
}

export interface RazorPay extends Document {
  orderId: string;
  amount: number;
  currency: string;
}

// availability model: for admin
// flow is like that when user submits form in that form client has to select a available slot of 2days
// if no. of request b/w any slot of duration 30 min is greater than 10 then this slot is unavailable

export interface Availability extends Document {
  startTime: string;
  endTime: string;
  date: Date;
  // servicesRequested: mongoose.Types.ObjectId; 
}
