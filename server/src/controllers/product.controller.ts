import { Response, Request, NextFunction } from "express";
import * as productService from "../services/product.service.js";

export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const products = await productService.getProducts();

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
}

export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const product = await productService.createProduct(req.body);

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

export async function getProductById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);

    const product = await productService.getProductById(id);

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);

    const product = await productService.updateProduct(id, req.body);

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);

    const product = await productService.deleteProduct(id);

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
}
