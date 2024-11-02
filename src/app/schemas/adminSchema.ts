import { z } from 'zod';

// Define FieldItems schema separately
// const FieldItemsSchema = z.object({
//   type: z.string().min(1, "Type is required"),
//   name: z.string().min(1, "Name is required"),
//   label: z.string().min(1, "Label is required"),
// });

// Schema for service data including file validation
const serviceSchema = z.object({
  thumbnail: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: "Thumbnail is required and must be a valid file.",
    }),
  functions: z.array(z.string())
    .optional().nullable(),
    functionsFile: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: "Text file is required and must be a valid file.",
    }).optional()
    .nullable(),
  serviceName: z.string().min(1, "Service name is required"),
  servicePrice: z.string().min(1, "Service price is required"),
  categoryId: z.string().min(1, "Category Name is required"),
  isAvailable: z.boolean(),
});

export { serviceSchema };
