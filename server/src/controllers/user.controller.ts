import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service.js";

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const users = await userService.getUsers();

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { first_name, last_name, email, password, role } = req.body;

    const user = await userService.createUser({
      first_name,
      last_name,
      email,
      password,
      role,
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);

    const user = await userService.updateUser(id, req.body);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  await userService.deleteUser(id);
  res.status(201).json();
}

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);

    const user = await userService.getUserById(id);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}
