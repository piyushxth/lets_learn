import { Router } from "express";

import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import productRoutes from "./product.route.js";
import categoryRoutes from "./category.route.js";
import sizeRoutes from "./size.routes.js";
import colorRoutes from "./color.routes.js";
import orderRoutes from "./order.routes.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/product", productRoutes);
router.use("/category", categoryRoutes);
router.use("/size", sizeRoutes);
router.use("/color", colorRoutes);
router.use("/orders", orderRoutes);

export default router;
