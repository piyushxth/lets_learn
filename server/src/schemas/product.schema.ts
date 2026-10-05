import { z } from "zod";

const imageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  alt_text: z.string().optional(),
  position: z.number().int().min(0),
});

const variantSchema = z.object({
  color_id: z.number().int().positive().nullable(),
  size_id: z.number().int().positive().nullable(),

  sku: z.string().min(1).trim(),

  price: z
    .string()
    .min(1)
    .refine(
      (value) => !Number.isNaN(Number(value)),
      "Price must be a valid number",
    ),

  stock: z.number().int().min(0),

  images: z.array(imageSchema),
});

export const createProductSchema = z.object({
  name: z.string().min(1).trim(),

  slug: z.string().min(1).trim(),

  description: z.string().optional(),

  category_id: z.number().int().positive(),

  images: z.array(imageSchema),

  variants: z.array(variantSchema),
});

export type CreateProductData = z.infer<typeof createProductSchema>;

const updateImageSchema = z.object({
  id: z.number().int().positive().optional(),

  url: z.string().url("Invalid image URL"),

  alt_text: z.string().optional(),

  position: z.number().int().min(0),
});

const updateVariantSchema = z.object({
  id: z.number().int().positive().optional(),

  color_id: z.number().int().positive().nullable(),

  size_id: z.number().int().positive().nullable(),

  sku: z.string().min(1).trim(),

  price: z
    .number()
    .min(1)
    .refine(
      (value) => !Number.isNaN(Number(value)),
      "Price must be a valid number",
    )
    .refine((value) => Number(value) >= 0, "Price cannot be negative"),

  stock: z.number().int().min(0),

  images: z.array(updateImageSchema),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).trim().optional(),

  slug: z.string().min(1).trim().optional(),

  description: z.string().optional(),

  category_id: z.number().int().positive().optional(),

  images: z.array(updateImageSchema).optional(),

  variants: z.array(updateVariantSchema).optional(),

  deleted_image_ids: z.array(z.number().int().positive()).optional(),

  deleted_variant_ids: z.array(z.number().int().positive()).optional(),
});

export type UpdateProductData = z.infer<typeof updateProductSchema>;
