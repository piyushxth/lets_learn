import { Router } from "express";

import {
  getProductImages,
  getImageById,
  createImage,
  updateImage,
  deleteImage,
} from "../controllers/image.controller.js";

const router = Router();

// Get all images for a product
router.get("/:productId/images", getProductImages);

// Get one image
router.get("/:productId/images/:imageId", getImageById);

// Create image
router.post("/:productId/images", createImage);

// Update image
router.patch("/:productId/images/:imageId", updateImage);

// Delete image
router.delete("/:productId/images/:imageId", deleteImage);

export default router;
