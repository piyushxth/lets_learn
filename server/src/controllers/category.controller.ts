import { Request, Response, NextFunction } from "express";
import * as categoryService from "../services/category.service.js";

export async function getCategory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const category = await categoryService.getCategory();
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
}

export async function getCategoryById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);

    const category = await categoryService.getCategoryById(id);

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
}

export async function createCategory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name } = req.body;
    const category = await categoryService.createCategory({
      name,
    });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;
    const category = await categoryService.updateCategory(id, {
      name,
    });

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);
    const product = await categoryService.deleteCategory(id);

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
}
