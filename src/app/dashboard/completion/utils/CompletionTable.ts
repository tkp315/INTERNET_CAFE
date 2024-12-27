import { PaymentStatus, PaymentType } from "@/types/models.types";

export interface CompletionTable {
  id: string;
  serviceName: string; //t

  serviceId: string;
  servicePrice: string; //t
  paymentStatus: PaymentStatus; //t
  clientEmail: string;
  clientName: string;
  clientId: string;
  clientPhone: string; //t
  paymentId: string; // sheet_payment
  paymentType?: PaymentType; //sheet_payment
  orderId?: string; //sheet_payment
  amount?: number; // sheet_payment
  response_receipt?: string; //sheet_service
}
