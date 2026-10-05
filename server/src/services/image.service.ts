import { AppError } from "../errors/AppError.js";
import prisma from "../lib/prisma.js";

// --------------------------------------------------
// Get all images for a product
// --------------------------------------------------

export async function getProductImages(productId: number) {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      deleted_at: null,
    },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return prisma.image.findMany({
    where: {
      entity_type: "PRODUCT",
      entity_id: productId,
    },
    orderBy: {
      position: "asc",
    },
  });
}

// --------------------------------------------------
// Get one image for a product
// --------------------------------------------------

export async function getImageById(productId: number, imageId: number) {
  const image = await prisma.image.findFirst({
    where: {
      id: imageId,
      entity_type: "PRODUCT",
      entity_id: productId,
    },
  });

  if (!image) {
    throw new AppError("Product image not found", 404);
  }

  return image;
}

// --------------------------------------------------
// Create image for a product
// --------------------------------------------------

export async function createImage(
  productId: number,
  data: {
    url: string;
    alt_text?: string;
    position?: number;
  },
) {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      deleted_at: null,
    },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const image = await prisma.image.create({
    data: {
      url: data.url,
      alt_text: data.alt_text,
      position: data.position ?? 0,

      entity_type: "PRODUCT",
      entity_id: productId,
    },
  });

  return image;
}

// --------------------------------------------------
// Update image
// --------------------------------------------------

export async function updateImage(
  productId: number,
  imageId: number,
  data: {
    url?: string;
    alt_text?: string;
    position?: number;
  },
) {
  const image = await prisma.image.findFirst({
    where: {
      id: imageId,
      entity_type: "PRODUCT",
      entity_id: productId,
    },
  });

  if (!image) {
    throw new AppError("Product image not found", 404);
  }

  return prisma.image.update({
    where: {
      id: imageId,
    },
    data,
  });
}

// --------------------------------------------------
// Delete image
// --------------------------------------------------

export async function deleteImage(productId: number, imageId: number) {
  const image = await prisma.image.findFirst({
    where: {
      id: imageId,
      entity_type: "PRODUCT",
      entity_id: productId,
    },
  });

  if (!image) {
    throw new AppError("Product image not found", 404);
  }

  await prisma.image.delete({
    where: {
      id: imageId,
    },
  });

  return {
    message: "Product image deleted successfully",
  };
}
