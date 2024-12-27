
import { z } from "zod";

export const userTableSchema =z.object( {
    name:z.string(),
    email:z.string(),
    phoneNo:z.string(),
    _id:z.string().optional()
})

export type UserType = z.infer<typeof userTableSchema>;