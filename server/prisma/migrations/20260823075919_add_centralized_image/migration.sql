/*
  Warnings:

  - You are about to drop the `ProductImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductImageToProductVariant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_product_id_fkey";

-- DropForeignKey
ALTER TABLE "_ProductImageToProductVariant" DROP CONSTRAINT "_ProductImageToProductVariant_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductImageToProductVariant" DROP CONSTRAINT "_ProductImageToProductVariant_B_fkey";

-- DropTable
DROP TABLE "ProductImage";

-- DropTable
DROP TABLE "_ProductImageToProductVariant";

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "alt_text" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "entity_type" TEXT NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Image_entity_type_entity_id_idx" ON "Image"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "Order_user_id_idx" ON "Order"("user_id");

-- CreateIndex
CREATE INDEX "Product_category_id_idx" ON "Product"("category_id");

-- CreateIndex
CREATE INDEX "ProductVariant_product_id_idx" ON "ProductVariant"("product_id");

-- CreateIndex
CREATE INDEX "ProductVariant_color_id_idx" ON "ProductVariant"("color_id");

-- CreateIndex
CREATE INDEX "ProductVariant_size_id_idx" ON "ProductVariant"("size_id");

-- RenameIndex
ALTER INDEX "Category_name_active_unique" RENAME TO "Category_name_key";
