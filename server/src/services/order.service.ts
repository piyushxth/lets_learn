import prisma from "../lib/prisma.js";
import { AppError } from "../errors/AppError.js";

import type {
  createOrderData,
  updateOrderStatusData,
} from "../schemas/order.schema.js";

// ============================================================
// GET ALL ORDERS
// ============================================================

export async function getOrders() {
  const orders = await prisma.order.findMany({
    where: {
      deleted_at: null,
    },
    include: {
      user: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
        },
      },

      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },

          variant: {
            include: {
              color: true,
              size: true,
            },
          },
        },
      },
    },

    orderBy: {
      created_at: "desc",
    },
  });

  return orders;
}

// ============================================================
// GET ORDER BY ID
// ============================================================

export async function getOrderById(id: number) {
  const order = await prisma.order.findFirst({
    where: {
      id,
      deleted_at: null,
    },

    include: {
      user: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
        },
      },

      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },

          variant: {
            include: {
              color: true,
              size: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  return order;
}

// ============================================================
// GET ORDERS BY USER
// ============================================================

export async function getOrdersByUserId(userId: number) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      deleted_at: null,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const orders = await prisma.order.findMany({
    where: {
      user_id: userId,
      deleted_at: null,
    },

    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },

          variant: {
            include: {
              color: true,
              size: true,
            },
          },
        },
      },
    },

    orderBy: {
      created_at: "desc",
    },
  });

  return orders;
}

// ============================================================
// CREATE ORDER
// ============================================================

export async function createOrder(data: createOrderData) {
  const { user_id, items } = data;

  /*
   * Everything related to creating an order happens
   * inside one transaction.
   */
  const order = await prisma.$transaction(async (tx) => {
    // --------------------------------------------------------
    // 1. Check user
    // --------------------------------------------------------

    const user = await tx.user.findFirst({
      where: {
        id: user_id,
        deleted_at: null,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // --------------------------------------------------------
    // 2. Prevent duplicate variants in the same order
    // --------------------------------------------------------

    const variantIds = items.map((item) => item.variant_id);

    const uniqueVariantIds = new Set(variantIds);

    if (uniqueVariantIds.size !== variantIds.length) {
      throw new AppError(
        "The same product variant cannot be added multiple times",
        400,
      );
    }

    // --------------------------------------------------------
    // 3. Get all variants
    // --------------------------------------------------------

    const variants = await tx.productVariant.findMany({
      where: {
        id: {
          in: variantIds,
        },
      },

      include: {
        product: true,
        color: true,
        size: true,
      },
    });

    // --------------------------------------------------------
    // 4. Check all variants exist
    // --------------------------------------------------------

    if (variants.length !== items.length) {
      throw new AppError("One or more product variants were not found", 404);
    }

    // --------------------------------------------------------
    // 5. Check stock and calculate totals
    // --------------------------------------------------------

    let total = 0;

    const orderItems = [];

    for (const item of items) {
      const variant = variants.find((v) => v.id === item.variant_id);

      if (!variant) {
        throw new AppError(`Variant ${item.variant_id} not found`, 404);
      }

      // Check stock
      if (variant.stock < item.quantity) {
        throw new AppError(`Not enough stock for ${variant.product.name}`, 400);
      }

      const unitPrice = Number(variant.price);

      const subtotal = unitPrice * item.quantity;

      total += subtotal;

      // Build OrderItem
      orderItems.push({
        product_id: variant.product_id,
        variant_id: variant.id,
        quantity: item.quantity,
        unit_price: variant.price,
        subtotal,
        product_name: variant.product.name,
        variant_name: buildVariantName(variant.color?.name, variant.size?.name),
      });
    }

    // --------------------------------------------------------
    // 6. Create Order
    // --------------------------------------------------------

    const order = await tx.order.create({
      data: {
        user_id,
        total,
        status: "PENDING",

        items: {
          create: orderItems,
        },
      },

      include: {
        items: true,
      },
    });

    // --------------------------------------------------------
    // 7. Reduce stock
    // --------------------------------------------------------

    for (const item of items) {
      const updatedVariant = await tx.productVariant.updateMany({
        where: {
          id: item.variant_id,

          // Important:
          // Only update if enough stock still exists.
          stock: {
            gte: item.quantity,
          },
        },

        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      if (updatedVariant.count === 0) {
        throw new AppError(
          "Stock changed while creating the order. Please try again.",
          409,
        );
      }
    }

    return order;
  });

  return order;
}

// ============================================================
// UPDATE ORDER STATUS
// ============================================================

export async function updateOrderStatus(
  id: number,
  data: updateOrderStatusData,
) {
  const existingOrder = await prisma.order.findFirst({
    where: {
      id,
      deleted_at: null,
    },
  });

  if (!existingOrder) {
    throw new AppError("Order not found", 404);
  }

  // Don't allow changing a cancelled order
  if (existingOrder.status === "CANCELLED") {
    throw new AppError("A cancelled order cannot be updated", 400);
  }

  // Don't allow changing a delivered order
  if (existingOrder.status === "DELIVERED") {
    throw new AppError("A delivered order cannot be updated", 400);
  }

  const order = await prisma.order.update({
    where: {
      id,
    },

    data: {
      status: data.status,
    },

    include: {
      items: true,
    },
  });

  return order;
}

// ============================================================
// DELETE ORDER
// ============================================================

export async function deleteOrder(id: number) {
  const existingOrder = await prisma.order.findFirst({
    where: {
      id,
      deleted_at: null,
    },
  });

  if (!existingOrder) {
    throw new AppError("Order not found", 404);
  }

  const order = await prisma.order.update({
    where: {
      id,
    },

    data: {
      deleted_at: new Date(),
    },
  });

  return order;
}

// ============================================================
// HELPER
// ============================================================

function buildVariantName(colorName?: string | null, sizeName?: string | null) {
  const parts = [colorName, sizeName].filter(Boolean);

  return parts.length > 0 ? parts.join(" / ") : null;
}
