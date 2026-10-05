import { Router } from "express";

import {
  getOrders,
  getOrderById,
  getOrdersByUserId,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/order.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  createOrderSchema,
  updateOrderStatusSchema,
  orderIdSchema,
} from "../schemas/order.schema.js";

const router = Router();

router.get("/", getOrders);
router.get(
  "/user/:userId",
  authMiddleware,
  requireRole("ADMIN"),
  getOrdersByUserId,
);

router.get("/:id", authMiddleware, validate(orderIdSchema), getOrderById);

router.post("/", authMiddleware, validate(createOrderSchema), createOrder);

router.patch(
  "/:id/status",
  authMiddleware,
  requireRole("ADMIN"),
  validate(orderIdSchema),
  validate(updateOrderStatusSchema),
  updateOrderStatus,
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole("ADMIN"),
  validate(orderIdSchema),
  deleteOrder,
);

export default router;
