import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { first_name, last_name, email, password } = req.body;

    const user = await authService.registerUser({
      first_name,
      last_name,
      email,
      password,
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const user = await authService.loginUser({
      email,
      password,
    });

    res.cookie("access_token", user.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
      path: "/",
    });

    const { token, ...userWithoutToken } = user;

    res.status(200).json({
      message: "Login successful",
      user: userWithoutToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.getCurrentUser(req.user!.id);

    res.status(200).json({
      user,
    });
  } catch (error) {
    next(error);
  }
}

// export async function getMe(req: Request, res: Response, next: NextFunction) {
//   try {
//     const userId = req.user!.id;

//     const user = await authService.getUserById(userId);

//     res.status(200).json(user);
//   } catch (error) {
//     next(error);
//   }
// }
