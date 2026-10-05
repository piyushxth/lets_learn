import { Router } from "express";
import {
  getCategory,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { categorySchema } from "../schemas/category.schema.js";

const router = Router();

router.get("/", getCategory);
router.get("/:id", getCategoryById);
router.post(
  "/",
  authMiddleware,
  requireRole("ADMIN"),
  validate(categorySchema),
  createCategory,
);
router.patch("/:id", authMiddleware, requireRole("ADMIN"), updateCategory);
router.delete("/:id", authMiddleware, requireRole("ADMIN"), deleteCategory);

export default router;
