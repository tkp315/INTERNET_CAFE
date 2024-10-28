import { z } from "zod";
// just for learning purpose i separated passwordValidationSchema

const passwordValidationSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password must contain at least 6 characters" })
    .max(16, { message: "Password must contain no more than 10 characters" }),
  confirmPassword: z
    .string()
    .min(6, { message: "Confirm Password is required" }),
});

// Extend the password validation schema into the signup schema
export const signupSchema = passwordValidationSchema.extend({
  // Name validation: Minimum 2 characters, only letters, spaces, hyphens, and apostrophes allowed
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .regex(/^[a-zA-Z\s'-]+$/, {
      message:
        "Name must not contain special characters other than spaces, hyphens, or apostrophes",
    }),

  // Email validation: Must be a valid email address
  email: z.string().email({ message: "Invalid email address" }),

  // OTP validation: Must be a number of 6 digits
  otp: z
    .string()
    .length(6, { message: "OTP must be 6 digits long" })
    .regex(/^\d+$/, { message: "OTP must be numeric" }),

  // Phone number validation: Must be a valid 10-digit number
  phoneNo: z
    .string()
    .regex(/^\d{10}$/, { message: "Phone number must be 10 digits" }),
});

// Use superRefine to validate confirmPassword against password
signupSchema.superRefine((data,ctx)=>{
    if(data.password!==data.confirmPassword){
      ctx.addIssue({
        code:z.ZodIssueCode.custom,
        message: "Passwords must match",
      path: ["confirmPassword"],
      })
    }
})

export const loginSchema = z.object({
    password: z
    .string()
    .min(6, { message: "Password must contain at least 6 characters" })
    .max(16, { message: "Password must contain no more than 10 characters" }),
    email: z.string().email({ message: "Invalid email address" }),

})
// Export the complete signup schema

