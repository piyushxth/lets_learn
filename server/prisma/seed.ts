import "dotenv/config";

import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🧹 Clearing existing data...");

  // Delete in dependency order
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();

  await prisma.image.deleteMany();

  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();

  await prisma.color.deleteMany();
  await prisma.size.deleteMany();
  await prisma.category.deleteMany();

  await prisma.user.deleteMany();

  console.log("✅ Existing data cleared.");

  // =========================================================
  // PASSWORD
  // =========================================================

  const hashedPassword = await bcrypt.hash("password123", 10);

  // =========================================================
  // USERS
  // =========================================================

  console.log("👤 Creating users...");

  const admin = await prisma.user.create({
    data: {
      first_name: "Admin",
      last_name: "User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const user1 = await prisma.user.create({
    data: {
      first_name: "Bishal",
      last_name: "Tamang",
      email: "bishal@example.com",
      password: hashedPassword,
      role: "USER",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      password: hashedPassword,
      role: "USER",
    },
  });

  console.log("✅ Users created.");

  // =========================================================
  // CATEGORIES
  // =========================================================

  console.log("📂 Creating categories...");

  const tshirtCategory = await prisma.category.create({
    data: {
      name: "T-Shirts",
    },
  });

  const hoodieCategory = await prisma.category.create({
    data: {
      name: "Hoodies",
    },
  });

  const pantsCategory = await prisma.category.create({
    data: {
      name: "Pants",
    },
  });

  console.log("✅ Categories created.");

  // =========================================================
  // COLORS
  // =========================================================

  console.log("🎨 Creating colors...");

  const black = await prisma.color.create({
    data: {
      name: "Black",
    },
  });

  const white = await prisma.color.create({
    data: {
      name: "White",
    },
  });

  const red = await prisma.color.create({
    data: {
      name: "Red",
    },
  });

  const blue = await prisma.color.create({
    data: {
      name: "Blue",
    },
  });

  console.log("✅ Colors created.");

  // =========================================================
  // SIZES
  // =========================================================

  console.log("📏 Creating sizes...");

  const small = await prisma.size.create({
    data: {
      name: "S",
    },
  });

  const medium = await prisma.size.create({
    data: {
      name: "M",
    },
  });

  const large = await prisma.size.create({
    data: {
      name: "L",
    },
  });

  const extraLarge = await prisma.size.create({
    data: {
      name: "XL",
    },
  });

  console.log("✅ Sizes created.");

  // =========================================================
  // PRODUCTS
  // =========================================================

  console.log("👕 Creating products...");

  const basicTshirt = await prisma.product.create({
    data: {
      name: "Basic Cotton T-Shirt",
      slug: "basic-cotton-t-shirt",
      description: "Comfortable everyday cotton t-shirt.",
      category_id: tshirtCategory.id,
    },
  });

  const oversizedTshirt = await prisma.product.create({
    data: {
      name: "Oversized T-Shirt",
      slug: "oversized-t-shirt",
      description: "Relaxed fit oversized t-shirt.",
      category_id: tshirtCategory.id,
    },
  });

  const classicHoodie = await prisma.product.create({
    data: {
      name: "Classic Hoodie",
      slug: "classic-hoodie",
      description: "Warm and comfortable everyday hoodie.",
      category_id: hoodieCategory.id,
    },
  });

  const cargoPants = await prisma.product.create({
    data: {
      name: "Cargo Pants",
      slug: "cargo-pants",
      description: "Durable cargo pants with multiple pockets.",
      category_id: pantsCategory.id,
    },
  });

  console.log("✅ Products created.");

  // =========================================================
  // PRODUCT VARIANTS
  // =========================================================

  console.log("🎯 Creating product variants...");

  // -------------------------
  // Basic T-Shirt
  // -------------------------

  const basicBlackM = await prisma.productVariant.create({
    data: {
      product_id: basicTshirt.id,
      color_id: black.id,
      size_id: medium.id,
      sku: "BCT-BLK-M",
      price: 1800,
      stock: 25,
    },
  });

  const basicBlackL = await prisma.productVariant.create({
    data: {
      product_id: basicTshirt.id,
      color_id: black.id,
      size_id: large.id,
      sku: "BCT-BLK-L",
      price: 1800,
      stock: 20,
    },
  });

  const basicWhiteM = await prisma.productVariant.create({
    data: {
      product_id: basicTshirt.id,
      color_id: white.id,
      size_id: medium.id,
      sku: "BCT-WHT-M",
      price: 1800,
      stock: 30,
    },
  });

  const basicWhiteL = await prisma.productVariant.create({
    data: {
      product_id: basicTshirt.id,
      color_id: white.id,
      size_id: large.id,
      sku: "BCT-WHT-L",
      price: 1800,
      stock: 25,
    },
  });

  // -------------------------
  // Oversized T-Shirt
  // -------------------------

  const oversizedBlackL = await prisma.productVariant.create({
    data: {
      product_id: oversizedTshirt.id,
      color_id: black.id,
      size_id: large.id,
      sku: "OST-BLK-L",
      price: 2200,
      stock: 15,
    },
  });

  const oversizedWhiteM = await prisma.productVariant.create({
    data: {
      product_id: oversizedTshirt.id,
      color_id: white.id,
      size_id: medium.id,
      sku: "OST-WHT-M",
      price: 2200,
      stock: 18,
    },
  });

  const oversizedRedL = await prisma.productVariant.create({
    data: {
      product_id: oversizedTshirt.id,
      color_id: red.id,
      size_id: large.id,
      sku: "OST-RED-L",
      price: 2200,
      stock: 10,
    },
  });

  // -------------------------
  // Classic Hoodie
  // -------------------------

  const hoodieBlackL = await prisma.productVariant.create({
    data: {
      product_id: classicHoodie.id,
      color_id: black.id,
      size_id: large.id,
      sku: "HD-BLK-L",
      price: 3500,
      stock: 12,
    },
  });

  const hoodieBlueXL = await prisma.productVariant.create({
    data: {
      product_id: classicHoodie.id,
      color_id: blue.id,
      size_id: extraLarge.id,
      sku: "HD-BLU-XL",
      price: 3500,
      stock: 8,
    },
  });

  // -------------------------
  // Cargo Pants
  // -------------------------

  const cargoBlackM = await prisma.productVariant.create({
    data: {
      product_id: cargoPants.id,
      color_id: black.id,
      size_id: medium.id,
      sku: "CP-BLK-M",
      price: 4200,
      stock: 10,
    },
  });

  const cargoBlackL = await prisma.productVariant.create({
    data: {
      product_id: cargoPants.id,
      color_id: black.id,
      size_id: large.id,
      sku: "CP-BLK-L",
      price: 4200,
      stock: 10,
    },
  });

  console.log("✅ Product variants created.");

  // =========================================================
  // IMAGES
  // =========================================================

  console.log("🖼️ Creating images...");

  await prisma.image.createMany({
    data: [
      // Basic T-Shirt
      {
        product_id: basicTshirt.id,
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        alt_text: "Basic Cotton T-Shirt",
        position: 0,
      },
      {
        variant_id: basicBlackM.id,
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        alt_text: "Black Basic Cotton T-Shirt",
        position: 0,
      },

      // Oversized T-Shirt
      {
        product_id: oversizedTshirt.id,
        url: "https://images.unsplash.com/photo-1503341504253-dff4815485f1",
        alt_text: "Oversized T-Shirt",
        position: 0,
      },

      // Hoodie
      {
        product_id: classicHoodie.id,
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
        alt_text: "Classic Hoodie",
        position: 0,
      },

      // Cargo Pants
      {
        product_id: cargoPants.id,
        url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80",
        alt_text: "Cargo Pants",
        position: 0,
      },
    ],
  });

  console.log("✅ Images created.");

  // =========================================================
  // ORDERS
  // =========================================================

  console.log("🛒 Creating orders...");

  // ---------------------------------------------------------
  // ORDER 1
  // ---------------------------------------------------------

  const order1Total =
    Number(basicBlackM.price) * 2 + Number(oversizedBlackL.price) * 1;

  const order1 = await prisma.order.create({
    data: {
      user_id: user1.id,
      total: order1Total,
      status: "PENDING",
    },
  });

  await prisma.orderItem.createMany({
    data: [
      {
        order_id: order1.id,
        product_id: basicTshirt.id,
        variant_id: basicBlackM.id,
        quantity: 2,
        unit_price: basicBlackM.price,
        subtotal: Number(basicBlackM.price) * 2,
        product_name: basicTshirt.name,
        variant_name: "Black / M",
      },
      {
        order_id: order1.id,
        product_id: oversizedTshirt.id,
        variant_id: oversizedBlackL.id,
        quantity: 1,
        unit_price: oversizedBlackL.price,
        subtotal: Number(oversizedBlackL.price),
        product_name: oversizedTshirt.name,
        variant_name: "Black / L",
      },
    ],
  });

  // ---------------------------------------------------------
  // ORDER 2
  // ---------------------------------------------------------

  const order2Total = Number(hoodieBlackL.price) + Number(cargoBlackL.price);

  const order2 = await prisma.order.create({
    data: {
      user_id: user2.id,
      total: order2Total,
      status: "CONFIRMED",
    },
  });

  await prisma.orderItem.createMany({
    data: [
      {
        order_id: order2.id,
        product_id: classicHoodie.id,
        variant_id: hoodieBlackL.id,
        quantity: 1,
        unit_price: hoodieBlackL.price,
        subtotal: Number(hoodieBlackL.price),
        product_name: classicHoodie.name,
        variant_name: "Black / L",
      },
      {
        order_id: order2.id,
        product_id: cargoPants.id,
        variant_id: cargoBlackL.id,
        quantity: 1,
        unit_price: cargoBlackL.price,
        subtotal: Number(cargoBlackL.price),
        product_name: cargoPants.name,
        variant_name: "Black / L",
      },
    ],
  });

  // ---------------------------------------------------------
  // ORDER 3
  // ---------------------------------------------------------

  const order3Total =
    Number(basicWhiteM.price) * 1 + Number(oversizedWhiteM.price) * 2;

  const order3 = await prisma.order.create({
    data: {
      user_id: user1.id,
      total: order3Total,
      status: "SHIPPED",
    },
  });

  await prisma.orderItem.createMany({
    data: [
      {
        order_id: order3.id,
        product_id: basicTshirt.id,
        variant_id: basicWhiteM.id,
        quantity: 1,
        unit_price: basicWhiteM.price,
        subtotal: Number(basicWhiteM.price),
        product_name: basicTshirt.name,
        variant_name: "White / M",
      },
      {
        order_id: order3.id,
        product_id: oversizedTshirt.id,
        variant_id: oversizedWhiteM.id,
        quantity: 2,
        unit_price: oversizedWhiteM.price,
        subtotal: Number(oversizedWhiteM.price) * 2,
        product_name: oversizedTshirt.name,
        variant_name: "White / M",
      },
    ],
  });

  // ---------------------------------------------------------
  // ORDER 4
  // ---------------------------------------------------------

  const order4Total = Number(hoodieBlueXL.price) * 1;

  const order4 = await prisma.order.create({
    data: {
      user_id: user2.id,
      total: order4Total,
      status: "DELIVERED",
    },
  });

  await prisma.orderItem.create({
    data: {
      order_id: order4.id,
      product_id: classicHoodie.id,
      variant_id: hoodieBlueXL.id,
      quantity: 1,
      unit_price: hoodieBlueXL.price,
      subtotal: Number(hoodieBlueXL.price),
      product_name: classicHoodie.name,
      variant_name: "Blue / XL",
    },
  });

  // ---------------------------------------------------------
  // ORDER 5
  // ---------------------------------------------------------

  const order5Total = Number(cargoBlackM.price) * 2;

  const order5 = await prisma.order.create({
    data: {
      user_id: user1.id,
      total: order5Total,
      status: "CANCELLED",
    },
  });

  await prisma.orderItem.create({
    data: {
      order_id: order5.id,
      product_id: cargoPants.id,
      variant_id: cargoBlackM.id,
      quantity: 2,
      unit_price: cargoBlackM.price,
      subtotal: Number(cargoBlackM.price) * 2,
      product_name: cargoPants.name,
      variant_name: "Black / M",
    },
  });

  console.log("✅ Orders created.");

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
