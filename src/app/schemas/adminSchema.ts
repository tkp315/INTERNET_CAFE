import { string, z } from 'zod';

// Schema for service data including file validation
const serviceSchema = z.object({
  thumbnail: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: "Thumbnail is required and must be a valid file.",
    }),
    functions:z.array(z.string(),{message:"Enter all the functions in text"}),
  serviceName: z.string().min(1, "Service name is required"),
  servicePrice: z.string().min(1, "Service price is required"),
  categoryId: z.string().min(1, "Category Name is required"),
  isAvailable: z.boolean(),
});

export  {serviceSchema};
