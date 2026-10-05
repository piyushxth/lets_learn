import { Router } from "express";
import {
  createUser,
  getUsers,
  deleteUser,
  updateUser,
  getUserById,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();
router.get("/", getUsers);
router.get("/:id", authMiddleware, requireRole("ADMIN"), getUserById);
router.post("/", authMiddleware, requireRole("ADMIN"), createUser);
router.delete("/:id", authMiddleware, requireRole("ADMIN"), deleteUser);
router.patch("/:id", authMiddleware, requireRole("ADMIN"), updateUser);

export default router;
