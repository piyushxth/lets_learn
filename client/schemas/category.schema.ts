import { z } from "zod";

export const createCategorySchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(3, "Atleast 3 characters required")
    .trim()
    .nonempty("Category name is requried"),
});

export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
