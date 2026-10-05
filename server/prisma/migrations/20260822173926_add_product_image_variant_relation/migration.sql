-- CreateTable
CREATE TABLE "_ProductImageToProductVariant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductImageToProductVariant_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProductImageToProductVariant_B_index" ON "_ProductImageToProductVariant"("B");

-- AddForeignKey
ALTER TABLE "_ProductImageToProductVariant" ADD CONSTRAINT "_ProductImageToProductVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "ProductImage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductImageToProductVariant" ADD CONSTRAINT "_ProductImageToProductVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
