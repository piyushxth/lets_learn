import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import logger from "../lib/logger.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.error(err.message);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
    });

    return;
  }

  res.status(500).json({
    message: "Internal server error",
  });
}
