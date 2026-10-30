import { AppError } from "../errors/AppError.js";
import prisma from "../lib/prisma.js";
import { CategorySchema } from "../schemas/category.schema.js";

export async function getCategory() {
  return await prisma.category.findMany({
    where: {
      deleted_at: null,
    },
  });
}

export async function getCategoryById(id: number) {
  const category = await prisma.category.findFirst({
    where: {
      id,
      deleted_at: null,
    },
  });

  if (!category) {
    return null;
  }

  return category;
}

export async function createCategory(data: CategorySchema) {
  return await prisma.category.create({ data });
}

export async function updateCategory(
  id: number,
  data: {
    name: string;
  },
) {
  console.log("from server", id, data);
  const category = await prisma.category.findFirst({
    where: {
      id,
      // name: data.name,x
      deleted_at: null,
    },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }
  if (data.name == category.name) {
    return;
  }

  return prisma.category.update({
    where: { id },
    data,
  });
}

export async function deleteCategory(id: number) {
  const category = await prisma.category.findUnique({
    where: {
      id,
      deleted_at: null,
    },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  await prisma.category.updateMany({
    where: {
      id,
    },
    data: {
      deleted_at: new Date(),
    },
  });

  return {
    message: "Category deleted successfully",
  };
}
