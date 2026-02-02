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

// Grading Schema
export const gradeSchema = z.object({
  grade: z.coerce
    .number("Grade must be a number")
    .min(0, "Grade cannot be less than 0")
    .max(10, "Grade cannot exceed 10"),
  remarks: z.string().min(5, "Remarks must be at least 5 characters long"),
});

// Announcement Schema
export const announcementSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(100),
  content: z.string().min(20, "Content must be at least 20 characters"),
  type: z.enum(["notice", "tutorial"]),
});

// Export the type for use in your React Form state
export type CourseFormData = z.infer<typeof createCourseSchema>;