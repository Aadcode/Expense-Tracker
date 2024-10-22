import { z } from "zod";

export const createUserValidation = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  mobileNumber: z
    .string()
    .length(10, "Mobile number must be exactly 10 digits")
    .regex(/^\d+$/, "Mobile number must be numeric"),
  password: z.string().min(8),
});
