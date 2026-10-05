import { Router } from "express";

import {
  getProductVariants,
  getVariantById,
  createVariant,
  updateVariant,
  deleteVariant,
} from "../controllers/variant.controller.js";

const router = Router();

router.get("/:productId/variants", getProductVariants);

router.get("/:productId/variants/:variantId", getVariantById);

router.post("/:productId/variants", createVariant);

router.patch("/:productId/variants/:variantId", updateVariant);

router.delete("/:productId/variants/:variantId", deleteVariant);

export default router;
