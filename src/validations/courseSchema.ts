import { z } from "zod";

export const createCourseSchema = z.object({
  name: z
    .string()
    .min(3, "Course name must be at least 3 characters")
    .max(255, "Course name is too long"),
  code: z
    .string()
    .min(2, "Course code must be at least 2 characters")
    .max(50, "Course code is too long"),
  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional()
    .or(z.literal("")), // Allows empty string if not provided
  teacher_id: z
    .string()
    .uuid("Please select a valid teacher from the list"), // Matches UUID type
});

// Export the type for use in your React Form state
export type CourseFormData = z.infer<typeof createCourseSchema>;