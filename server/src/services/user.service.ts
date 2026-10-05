import bcrypt from "bcrypt";

import prisma from "../lib/prisma.js";
import { AppError } from "../errors/AppError.js";

import type { CreateUserData, UpdateUserData } from "../schemas/user.schema.js";

export async function createUser(data: CreateUserData) {
  // Check if email already exists

  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser && existingUser.deleted_at === null) {
    throw new AppError("User with this email already exists", 409);
  }

  // Hash password

  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Create user

  const user = await prisma.user.create({
    data: {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    },

    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      role: true,
      created_at: true,
      updated_at: true,
    },
  });

  return user;
}

export async function getUsers() {
  return prisma.user.findMany({
    where: {
      deleted_at: null,
    },

    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      role: true,
      created_at: true,
      updated_at: true,
    },

    orderBy: {
      created_at: "desc",
    },
  });
}

export async function getUserById(id: number) {
  const user = await prisma.user.findFirst({
    where: {
      id,
      deleted_at: null,
    },

    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      role: true,
      created_at: true,
      updated_at: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
}

export async function updateUser(id: number, data: UpdateUserData) {
  // --------------------------------------------------
  // Check user
  // --------------------------------------------------

  const user = await prisma.user.findFirst({
    where: {
      id,
      deleted_at: null,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // --------------------------------------------------
  // Check email if it is being changed
  // --------------------------------------------------

  if (data.email !== undefined && data.email !== user.email) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (
      existingUser &&
      existingUser.id !== id &&
      existingUser.deleted_at === null
    ) {
      throw new AppError("User with this email already exists", 409);
    }
  }

  // --------------------------------------------------
  // Prepare update data
  // --------------------------------------------------

  const updateData: {
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    role?: "USER" | "ADMIN";
  } = {};

  if (data.first_name !== undefined) {
    updateData.first_name = data.first_name;
  }

  if (data.last_name !== undefined) {
    updateData.last_name = data.last_name;
  }

  if (data.email !== undefined) {
    updateData.email = data.email;
  }

  if (data.role !== undefined) {
    updateData.role = data.role;
  }

  // --------------------------------------------------
  // Password
  // --------------------------------------------------

  if (data.password !== undefined) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  // --------------------------------------------------
  // Update
  // --------------------------------------------------

  return prisma.user.update({
    where: {
      id,
    },

    data: updateData,

    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      role: true,
      created_at: true,
      updated_at: true,
    },
  });
}

export async function deleteUser(id: number) {
  const user = await prisma.user.findFirst({
    where: {
      id,
      deleted_at: null,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  await prisma.user.update({
    where: {
      id,
    },

    data: {
      deleted_at: new Date(),
    },
  });

  return {
    message: "User deleted successfully",
  };
}
