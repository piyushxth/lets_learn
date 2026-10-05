/*
  Warnings:

  - A unique constraint covering the columns `[product_id,color_id,size_id]` on the table `ProductVariant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_product_id_color_id_size_id_key" ON "ProductVariant"("product_id", "color_id", "size_id");
