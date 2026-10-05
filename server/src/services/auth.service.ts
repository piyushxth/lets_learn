import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import { AppError } from "../errors/AppError.js";
import jwt from "jsonwebtoken";

export async function registerUser(data: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: hashedPassword,
    },
  });

  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
  };
}

export async function loginUser(data: { email: string; password: string }) {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const passwordMatch = await bcrypt.compare(data.password, user.password);

  if (!passwordMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h",
    },
  );

  return {
    token,
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role,
  };
}

export async function getCurrentUser(userId: number) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      deleted_at: null,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
}

export async function getUserById(userId: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      created_at: true,
      update_at: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
}
