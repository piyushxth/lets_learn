import { AppError } from "../errors/AppError.js";
import prisma from "../lib/prisma.js";
import {
  CreateProductData,
  UpdateProductData,
} from "../schemas/product.schema.js";

export async function getProducts() {
  const products = await prisma.product.findMany({
    where: {
      deleted_at: null,
    },
    include: {
      category: true,

      variants: {
        include: {
          color: true,
          size: true,
          images: {
            orderBy: {
              position: "asc",
            },
          },
        },
      },

      images: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  return products;
}

export async function createProduct(data: CreateProductData) {
  // 1. Check category
  const category = await prisma.category.findFirst({
    where: {
      id: data.category_id,
      deleted_at: null,
    },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  // 2. Check slug
  const existingProduct = await prisma.product.findUnique({
    where: {
      slug: data.slug,
    },
  });

  if (existingProduct && existingProduct.deleted_at === null) {
    throw new AppError("Product with this slug already exists", 409);
  }

  // 3. Create everything in one transaction
  const product = await prisma.$transaction(async (tx) => {
    const newProduct = await tx.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        category_id: data.category_id,

        images: {
          create: data.images?.map((image) => ({
            url: image.url,
            alt_text: image.alt_text,
            position: image.position ?? 0,
          })),
        },

        variants: {
          create: data.variants?.map((variant) => ({
            color_id: variant.color_id,
            size_id: variant.size_id,
            sku: variant.sku,
            price: variant.price,
            stock: variant.stock,

            images: {
              create: variant.images?.map((image) => ({
                url: image.url,
                alt_text: image.alt_text,
                position: image.position ?? 0,
              })),
            },
          })),
        },
      },

      include: {
        category: true,

        images: true,

        variants: {
          include: {
            color: true,
            size: true,
            images: true,
          },
        },
      },
    });

    return newProduct;
  });

  return product;
}

export async function getProductById(id: number) {
  const product = await prisma.product.findFirst({
    where: {
      id,
      deleted_at: null,
    },

    include: {
      category: true,

      images: {
        orderBy: {
          position: "asc",
        },
      },

      variants: {
        include: {
          color: true,
          size: true,

          images: {
            orderBy: {
              position: "asc",
            },
          },
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  return product;
}

export async function updateProduct(id: number, data: UpdateProductData) {
  // --------------------------------------------------
  // Check product
  // --------------------------------------------------
  console.log("data", data);
  const existingProduct = await prisma.product.findFirst({
    where: {
      id,
      deleted_at: null,
    },
    include: {
      images: true,
      variants: {
        include: {
          images: true,
        },
      },
    },
  });

  if (!existingProduct) {
    throw new AppError("Product not found", 404);
  }

  // --------------------------------------------------
  // Check category
  // --------------------------------------------------

  if (data.category_id !== undefined) {
    const category = await prisma.category.findFirst({
      where: {
        id: data.category_id,
        deleted_at: null,
      },
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }
  }

  // --------------------------------------------------
  // Check slug
  // --------------------------------------------------

  if (data.slug !== undefined && data.slug !== existingProduct.slug) {
    const existingSlug = await prisma.product.findUnique({
      where: {
        slug: data.slug,
      },
    });

    if (
      existingSlug &&
      existingSlug.id !== id &&
      existingSlug.deleted_at === null
    ) {
      throw new AppError("Product with this slug already exists", 409);
    }
  }

  // --------------------------------------------------
  // TRANSACTION
  // --------------------------------------------------

  const product = await prisma.$transaction(async (tx) => {
    // ==================================================
    // 1. UPDATE PRODUCT
    // ==================================================

    await tx.product.update({
      where: {
        id,
      },
      data: {
        ...(data.name !== undefined && {
          name: data.name,
        }),

        ...(data.slug !== undefined && {
          slug: data.slug,
        }),

        ...(data.description !== undefined && {
          description: data.description,
        }),

        ...(data.category_id !== undefined && {
          category_id: data.category_id,
        }),
      },
    });

    // ==================================================
    // 2. PRODUCT IMAGES
    // ==================================================

    if (data.images !== undefined) {
      const submittedImageIds = data.images
        .filter((image) => image.id !== undefined)
        .map((image) => image.id!);

      // -----------------------------------------------
      // Delete images removed from the form
      // -----------------------------------------------

      const imagesToDelete = existingProduct.images.filter(
        (image) => !submittedImageIds.includes(image.id),
      );

      if (imagesToDelete.length > 0) {
        await tx.image.deleteMany({
          where: {
            id: {
              in: imagesToDelete.map((image) => image.id),
            },
            product_id: id,
          },
        });
      }

      // -----------------------------------------------
      // Update existing / create new images
      // -----------------------------------------------

      for (const image of data.images) {
        if (image.id !== undefined) {
          // Existing image

          await tx.image.update({
            where: {
              id: image.id,
            },
            data: {
              url: image.url,
              alt_text: image.alt_text,
              position: image.position ?? 0,
            },
          });
        } else {
          // New image

          await tx.image.create({
            data: {
              url: image.url,
              alt_text: image.alt_text,
              position: image.position ?? 0,
              product_id: id,
            },
          });
        }
      }
    }

    // ==================================================
    // 3. VARIANTS
    // ==================================================

    if (data.variants !== undefined) {
      const submittedVariantIds = data.variants
        .filter((variant) => variant.id !== undefined)
        .map((variant) => variant.id!);

      // -----------------------------------------------
      // Delete variants removed from the form
      // -----------------------------------------------

      const variantsToDelete = existingProduct.variants.filter(
        (variant) => !submittedVariantIds.includes(variant.id),
      );

      if (variantsToDelete.length > 0) {
        await tx.productVariant.deleteMany({
          where: {
            id: {
              in: variantsToDelete.map((variant) => variant.id),
            },
            product_id: id,
          },
        });
      }

      // -----------------------------------------------
      // Update existing / create new variants
      // -----------------------------------------------

      for (const variant of data.variants) {
        let variantId: number;

        if (variant.id !== undefined) {
          // ==========================================
          // EXISTING VARIANT
          // ==========================================

          const updatedVariant = await tx.productVariant.update({
            where: {
              id: variant.id,
            },
            data: {
              color_id: variant.color_id,
              size_id: variant.size_id,
              sku: variant.sku,
              price: variant.price,
              stock: variant.stock,
            },
          });

          variantId = updatedVariant.id;
        } else {
          // ==========================================
          // NEW VARIANT
          // ==========================================

          const newVariant = await tx.productVariant.create({
            data: {
              product_id: id,
              color_id: variant.color_id,
              size_id: variant.size_id,
              sku: variant.sku,
              price: variant.price,
              stock: variant.stock,
            },
          });

          variantId = newVariant.id;
        }

        // ==================================================
        // 4. VARIANT IMAGES
        // ==================================================

        if (variant.images !== undefined) {
          const existingVariant = existingProduct.variants.find(
            (v) => v.id === variant.id,
          );

          const existingVariantImages = existingVariant?.images ?? [];

          const submittedVariantImageIds = variant.images
            .filter((image) => image.id !== undefined)
            .map((image) => image.id!);

          // ----------------------------------------------
          // Delete removed variant images
          // ----------------------------------------------

          const variantImagesToDelete = existingVariantImages.filter(
            (image) => !submittedVariantImageIds.includes(image.id),
          );

          if (variantImagesToDelete.length > 0) {
            await tx.image.deleteMany({
              where: {
                id: {
                  in: variantImagesToDelete.map((image) => image.id),
                },
                variant_id: variantId,
              },
            });
          }

          // ----------------------------------------------
          // Update existing / create new images
          // ----------------------------------------------

          for (const image of variant.images) {
            if (image.id !== undefined) {
              // Existing image

              await tx.image.update({
                where: {
                  id: image.id,
                },
                data: {
                  url: image.url,
                  alt_text: image.alt_text,
                  position: image.position ?? 0,
                },
              });
            } else {
              // New image

              await tx.image.create({
                data: {
                  url: image.url,
                  alt_text: image.alt_text,
                  position: image.position ?? 0,
                  variant_id: variantId,
                },
              });
            }
          }
        }
      }
    }

    // ==================================================
    // 5. GET COMPLETE UPDATED PRODUCT
    // ==================================================

    return tx.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,

        images: {
          orderBy: {
            position: "asc",
          },
        },

        variants: {
          include: {
            color: true,
            size: true,

            images: {
              orderBy: {
                position: "asc",
              },
            },
          },
        },
      },
    });
  });

  return product;
}

export async function deleteProduct(id: number) {
  const product = await prisma.product.findFirst({
    where: {
      id,
      deleted_at: null,
    },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  await prisma.product.update({
    where: {
      id,
    },
    data: {
      deleted_at: new Date(),
    },
  });

  return {
    message: "Product deleted successfully",
  };
}
