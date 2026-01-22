import { z } from "zod";
export const createUserSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  role: z.string().min(1, "Role is required").refine(
    (val) => ["Student", "Teacher"].includes(val),
    { message: "Role must be Student or Teacher" }
  ),
});