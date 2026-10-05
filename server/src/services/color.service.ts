import prisma from "../lib/prisma.js";

export async function getColor() {
  return await prisma.color.findMany();
}
