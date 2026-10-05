import { Router } from "express";
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import {
  createVariant,
  deleteVariant,
  getProductVariants,
  getVariantById,
  updateVariant,
} from "../controllers/variant.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import {
  createImage,
  deleteImage,
  getImageById,
  getProductImages,
  updateImage,
} from "../controllers/image.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../schemas/product.schema.js";

const router = Router();

router.get("/", getProducts);
router.post(
  "/",
  authMiddleware,
  requireRole("ADMIN"),
  validate(createProductSchema),
  createProduct,
);
router.get("/:id", getProductById);
router.patch(
  "/:id",
  authMiddleware,
  requireRole("ADMIN"),
  validate(updateProductSchema),
  updateProduct,
);
router.delete("/:id", authMiddleware, requireRole("ADMIN"), deleteProduct);

// Productvariant
router.get("/:productId/variants", getProductVariants);
router.get("/:productId/variants/:variantId", getVariantById);
router.post(
  "/:productId/variants",
  authMiddleware,
  requireRole("ADMIN"),
  createVariant,
);

router.patch(
  "/:productId/variants/:variantId",
  authMiddleware,
  requireRole("ADMIN"),
  updateVariant,
);

router.delete(
  "/:productId/variants/:variantId",
  authMiddleware,
  requireRole("ADMIN"),
  deleteVariant,
);

// Get all images for a product
router.get("/:productId/images", getProductImages);
router.get("/:productId/images/:imageId", getImageById);
router.post(
  "/:productId/images",
  authMiddleware,
  requireRole("ADMIN"),
  createImage,
);

router.patch(
  "/:productId/images/:imageId",
  authMiddleware,
  requireRole("ADMIN"),
  updateImage,
);

router.delete(
  "/:productId/images/:imageId",
  authMiddleware,
  requireRole("ADMIN"),
  deleteImage,
);

export default router;
