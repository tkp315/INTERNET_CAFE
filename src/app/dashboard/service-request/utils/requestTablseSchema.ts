export interface ServiceRequestTable {
  id: string;

  serviceName: string;
  serviceId: string;
  servicePrice: string;

  thumbnail?:string
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;

  requestedFunctions: string[];

  interval:string;
  date: string;

  paymentDetails?: string;
  status: string;
  createdAt: string;

  formLink: string;
  completion: string;

}
