
import { z } from "zod";

export const userSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters"),

  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),

  phone: z
    .string()
    .trim()
    .optional(),

  password: z
    .string()
    .optional(),

  nrc: z
    .string()
    .trim()
    .min(1, "NRC is required"),

  address: z
    .string()
    .trim()
    .optional(),

  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type UserSchemaInput = z.infer<typeof userSchema>;
