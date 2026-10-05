import { Router } from "express";
import { getSize } from "../controllers/size.controller.js";

const router = Router();

router.get("/", getSize);

export default router;
