import { PaymentStatus, PaymentType, Status } from "@/types/models.types"

export interface CustomeServiceTable{
    id:string //copy_id
    name:string, // table
    files:string[], //sheet_service
    interval:string, //table
    date:string,//table
    completionId:string 
    status:Status, //t
    clientName:string, //sheet_client
    clientPhone:string,//sheet_client
    clientEmail:string,//sheet_client
    createdAt:string,// table
    paymentId:string // sheet_payment
    paymentStatus:PaymentStatus, //t
    paymentType?:PaymentType, //sheet_payment
    orderId?:string,//sheet_payment
    amount?:number, // sheet_payment
    response_receipt?:string, //sheet_service
    clientId:string

}