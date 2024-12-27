// _id
// name
// price
// category
// functions
// Forms
// isAvailable
// createdBy
import { z } from "zod";

export const serviceSchema = z.object({
    _id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    price: z.number().nonnegative("Price must be a non-negative number"),
    category: z.string().optional(),
    categoryId:z.string().optional(),
    // functions: z.array(z.string()).optional(),
    // Forms: z.array(z.string()).optional(), 
    isAvailable: z.boolean().default(true), // Default to true
    createdBy: z.string().min(1, "CreatedBy is required"),
    createdAt:z.string().optional(),
    thumbnail:z.string().optional(),
    functions:z.array(z.string()).optional(),
    forms:z.array(z.object(
      {
        FormField:z.array(z.object({
          name:z.string().optional(),
          label:z.string().optional(),
          type:z.string().optional(),
          _id:z.string().optional()
        })),
        description:z.string().optional(),
        title:z.string().optional(),
        _id:z.string().optional(),
        service:z.string().optional(),
        createdAt:z.string().optional()
       
      }
    )).optional()
   
  });
export type ServiceType = z.infer<typeof serviceSchema>;
//fuction and Forms in sheet