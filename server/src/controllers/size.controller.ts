import { Response, Request, NextFunction } from "express";
import * as sizeService from "../services/size.service.js";

export async function getSize(req: Request, res: Response, next: NextFunction) {
  try {
    const sizes = await sizeService.getSize();

    res.status(200).json(sizes);
  } catch (error) {
    next(error);
  }
}
