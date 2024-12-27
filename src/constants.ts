import { PaymentStatus, Status } from "./types/models.types"

export const MAX_REQ_PER_SLOT:number=10
export const DB_NAME:string = "shop-app"
// export const AUTO="auto";
// export const IMAGE="image";
// export const RAW = "raw";
// export const VIDEO="video";
export const SERVICE_STATUS = {
    ONGOING:Status.Ongoing,
    PENDING:Status.Pending,
    COMPLETED:Status.Completed,
    PAID:PaymentStatus.Paid,
    UNPAID:PaymentStatus.Unpaid
}