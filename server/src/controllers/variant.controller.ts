import { Request, Response, NextFunction } from "express";
import * as variantService from "../services/variant.service.js";

export async function getProductVariants(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const productId = Number(req.params.productId);

    const variants = await variantService.getProductVariants(productId);

    res.status(200).json(variants);
  } catch (error) {
    next(error);
  }
}

export async function getVariantById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const productId = Number(req.params.productId);
    const variantId = Number(req.params.variantId);

    const variant = await variantService.getVariantById(productId, variantId);

    res.status(200).json(variant);
  } catch (error) {
    next(error);
  }
}

export async function createVariant(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const productId = Number(req.params.productId);

    const { color_id, size_id, sku, price, stock } = req.body;

    const variant = await variantService.createVariant(productId, {
      color_id,
      size_id,
      sku,
      price,
      stock,
    });

    res.status(201).json(variant);
  } catch (error) {
    next(error);
  }
}

export async function updateVariant(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const productId = Number(req.params.productId);
    const variantId = Number(req.params.variantId);

    const { color_id, size_id, sku, price, stock } = req.body;

    const variant = await variantService.updateVariant(productId, variantId, {
      color_id,
      size_id,
      sku,
      price,
      stock,
    });

    res.status(200).json(variant);
  } catch (error) {
    next(error);
  }
}

export async function deleteVariant(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const productId = Number(req.params.productId);
    const variantId = Number(req.params.variantId);

    const result = await variantService.deleteVariant(productId, variantId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
