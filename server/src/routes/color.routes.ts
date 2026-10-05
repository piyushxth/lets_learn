import { Router } from "express";
import { getColor } from "../controllers/color.controller.js";

const router = Router();

router.get("/", getColor);

export default router;
