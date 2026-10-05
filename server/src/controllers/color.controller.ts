import { Response, Request, NextFunction } from "express";
import * as colorService from "../services/color.service.js";

export async function getColor(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const colors = await colorService.getColor();

    res.status(200).json(colors);
  } catch (error) {
    next(error);
  }
}
