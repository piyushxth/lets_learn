import prisma from "../lib/prisma.js";

export async function getSize() {
  return await prisma.size.findMany();
}
