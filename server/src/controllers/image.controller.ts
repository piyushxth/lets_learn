import { Request, Response, NextFunction } from "express";
import * as imageService from "../services/image.service.js";

export async function getProductImages(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const productId = Number(req.params.productId);

    const images = await imageService.getProductImages(productId);

    res.status(200).json(images);
  } catch (error) {
    next(error);
  }
}

export async function getImageById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const productId = Number(req.params.productId);
    const imageId = Number(req.params.imageId);

    const image = await imageService.getImageById(productId, imageId);

    res.status(200).json(image);
  } catch (error) {
    next(error);
  }
}

export async function createImage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const productId = Number(req.params.productId);

    const { url, alt_text, position } = req.body;

    const image = await imageService.createImage(productId, {
      url,
      alt_text,
      position,
    });

    res.status(201).json(image);
  } catch (error) {
    next(error);
  }
}

export async function updateImage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const productId = Number(req.params.productId);
    const imageId = Number(req.params.imageId);

    const { url, alt_text, position } = req.body;

    const image = await imageService.updateImage(productId, imageId, {
      url,
      alt_text,
      position,
    });

    res.status(200).json(image);
  } catch (error) {
    next(error);
  }
}

export async function deleteImage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const productId = Number(req.params.productId);
    const imageId = Number(req.params.imageId);

    const result = await imageService.deleteImage(productId, imageId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
