import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "At least 3 characters are required")
    .max(100, "Category name cannot exceed 100 characters"),

  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(120, "Slug cannot exceed 120 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens only",
    ),

  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional()
    .or(z.literal("")),

  image_url: z
    .string()
    .url("Please enter a valid image URL")
    .optional()
    .or(z.literal("")),

  is_active: z.boolean(),
});

export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
