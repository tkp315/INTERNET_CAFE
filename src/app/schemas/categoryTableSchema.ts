import { z } from "zod";
export const categorySchema = z.object({
    name:z.string(),
    services:z.number(),
    isAvailable:z.boolean(),
    createdBy:z.string(),
    updatedAt:z.string(),
    _id:z.string().optional(),
    description:z.string().optional()
})

export type CategoryType = z.infer<typeof categorySchema>

// isavailable, service_no, updatedAt : 