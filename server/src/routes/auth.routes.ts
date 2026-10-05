import { Router } from "express";
import { register, login, getMe } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.get("/admin-test", authMiddleware, requireRole("ADMIN"), (req, res) => {
  res.json({
    message: "Welcome Admin!",
  });
});

export default router;
