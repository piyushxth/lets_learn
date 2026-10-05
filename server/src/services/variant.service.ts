import { AppError } from "../errors/AppError.js";
import prisma from "../lib/prisma.js";

// Get all variants belonging to a product
export async function getProductVariants(productId: number) {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      deleted_at: null,
    },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return prisma.productVariant.findMany({
    where: {
      product_id: productId,
    },
    include: {
      color: true,
      size: true,
    },
    orderBy: {
      id: "asc",
    },
  });
}

// Get one specific variant
export async function getVariantById(productId: number, variantId: number) {
  const variant = await prisma.productVariant.findFirst({
    where: {
      id: variantId,
      product_id: productId,
    },
    include: {
      color: true,
      size: true,
      product: true,
    },
  });

  if (!variant) {
    throw new AppError("Product variant not found", 404);
  }

  return variant;
}

// Create a new variant
export async function createVariant(
  productId: number,
  data: {
    color_id?: number;
    size_id?: number;
    sku: string;
    price: number;
    stock: number;
  },
) {
  // Check product
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      deleted_at: null,
    },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // Check color if provided
  if (data.color_id !== undefined) {
    const color = await prisma.color.findUnique({
      where: {
        id: data.color_id,
      },
    });

    if (!color) {
      throw new AppError("Color not found", 404);
    }
  }

  // Check size if provided
  if (data.size_id !== undefined) {
    const size = await prisma.size.findUnique({
      where: {
        id: data.size_id,
      },
    });

    if (!size) {
      throw new AppError("Size not found", 404);
    }
  }

  // Check product Id color Id and Size Id
  const existingVariant = await prisma.productVariant.findFirst({
    where: {
      product_id: productId,
      color_id: data.color_id,
      size_id: data.size_id,
    },
  });

  if (existingVariant) {
    throw new AppError(
      "A variant with this color and size already exists for this product",
      409,
    );
  }

  const variant = await prisma.productVariant.create({
    data: {
      product_id: productId,
      color_id: data.color_id,
      size_id: data.size_id,
      sku: data.sku,
      price: data.price,
      stock: data.stock,
    },
    include: {
      color: true,
      size: true,
    },
  });

  return variant;
}

// Update a variant
export async function updateVariant(
  productId: number,
  variantId: number,
  data: {
    color_id?: number;
    size_id?: number;
    sku?: string;
    price?: number;
    stock?: number;
  },
) {
  const variant = await prisma.productVariant.findFirst({
    where: {
      id: variantId,
      product_id: productId,
    },
  });

  if (!variant) {
    throw new AppError("Product variant not found", 404);
  }

  // Check color if being changed
  if (data.color_id !== undefined) {
    const color = await prisma.color.findUnique({
      where: {
        id: data.color_id,
      },
    });

    if (!color) {
      throw new AppError("Color not found", 404);
    }
  }

  // Check size if being changed
  if (data.size_id !== undefined) {
    const size = await prisma.size.findUnique({
      where: {
        id: data.size_id,
      },
    });

    if (!size) {
      throw new AppError("Size not found", 404);
    }
  }

  // Check SKU only if SKU is being changed
  if (data.sku && data.sku !== variant.sku) {
    const existingVariant = await prisma.productVariant.findUnique({
      where: {
        sku: data.sku,
      },
    });

    if (existingVariant) {
      throw new AppError("SKU already exists", 409);
    }
  }

  return prisma.productVariant.update({
    where: {
      id: variantId,
    },
    data,
    include: {
      color: true,
      size: true,
    },
  });
}

// Delete a variant
export async function deleteVariant(productId: number, variantId: number) {
  const variant = await prisma.productVariant.findFirst({
    where: {
      id: variantId,
      product_id: productId,
    },
  });

  if (!variant) {
    throw new AppError("Product variant not found", 404);
  }

  await prisma.productVariant.delete({
    where: {
      id: variantId,
    },
  });

  return {
    message: "Product variant deleted successfully",
  };
}
