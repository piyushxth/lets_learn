import { Request, Response, NextFunction } from "express";
import * as orderService from "../services/order.service.js";

export async function getOrders(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const orders = await orderService.getOrders();

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
}

export async function getOrderById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);

    const order = await orderService.getOrderById(id);

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
}

export async function getOrdersByUserId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = Number(req.params.userId);

    const orders = await orderService.getOrdersByUserId(userId);

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
}

export async function createOrder(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { user_id, items } = req.body;

    const order = await orderService.createOrder({
      user_id,
      items,
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const order = await orderService.updateOrderStatus(id, status);

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
}

export async function deleteOrder(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);

    const order = await orderService.deleteOrder(id);

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
}
