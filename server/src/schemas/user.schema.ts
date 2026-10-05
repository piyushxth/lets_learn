import { z } from "zod";

export const createUserSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),

  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),

  email: z.string().email("Please enter a valid email address"),

  password: z.string().min(6, "Password must be at least 6 characters"),

  role: z.enum(["USER", "ADMIN"]),
});

export type CreateUserData = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .optional(),
  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .optional(),
  email: z.string().email("Please enter a valid email address").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
});
export type UpdateUserData = z.infer<typeof updateUserSchema>;
