import { z } from "zod";

// Schema for Profile Data
export const profileSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  date_of_birth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  phone_number: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  email: z.string().email("Invalid email address"),
});

// Schema for Security/Password Data
export const securitySchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Sets the error to the confirmPassword field
  });

// Export types derived from schemas
export type ProfileData = z.infer<typeof profileSchema>;
export type SecurityData = z.infer<typeof securitySchema>;