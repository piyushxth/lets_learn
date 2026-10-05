import { z } from "zod";

// ============================================================
// CREATE ORDER
// ============================================================

export const createOrderSchema = z.object({
  user_id: z.number().int().positive(),

  items: z
    .array(
      z.object({
        variant_id: z.number().int().positive(),

        quantity: z.number().int().positive(),
      }),
    )
    .min(1, "Order must contain at least one item"),
});

export type createOrderData = z.infer<typeof createOrderSchema>;

// ============================================================
// UPDATE ORDER STATUS
// ============================================================

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

export type updateOrderStatusData = z.infer<typeof updateOrderStatusSchema>;

// ============================================================
// ORDER ID
// ============================================================

export const orderIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "Invalid order ID").transform(Number),
});

export type orderIdData = z.infer<typeof orderIdSchema>;
