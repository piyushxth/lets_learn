import { z } from "zod";

const imageSchema = z.object({
  url: z.string().url("Please enter a valid image URL"),
  alt_text: z.string().optional(),
  position: z.number().int().min(0),
});

const variantSchema = z.object({
  color_id: z.number().nullable(),
  size_id: z.number().nullable(),

  sku: z.string().min(1, "SKU is required").trim(),

  price: z.number().positive("Price must be greater than 0"),

  stock: z
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),

  images: z.array(imageSchema),
});

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required").trim(),

  slug: z.string().min(1, "Slug is required").trim(),

  description: z.string().optional(),

  category_id: z.number().int().positive("Please select a category"),

  images: z.array(imageSchema),

  variants: z.array(variantSchema),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;
