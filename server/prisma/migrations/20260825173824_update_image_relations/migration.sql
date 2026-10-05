/*
  Warnings:

  - You are about to drop the column `entity_id` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `entity_type` on the `Image` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Image_entity_type_entity_id_idx";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "entity_id",
DROP COLUMN "entity_type",
ADD COLUMN     "product_id" INTEGER,
ADD COLUMN     "variant_id" INTEGER;

-- CreateIndex
CREATE INDEX "Image_product_id_idx" ON "Image"("product_id");

-- CreateIndex
CREATE INDEX "Image_variant_id_idx" ON "Image"("variant_id");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
