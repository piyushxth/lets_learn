"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/app/types/product";

interface ListProductsProps {
  products: Product[];
}

export const ListProducts = ({ products }: ListProductsProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => {
        const mainImage = product.images[0];

        return (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group"
          >
            <div className="overflow-hidden rounded-lg bg-gray-100">
              {mainImage ? (
                <Image
                  src={mainImage.url}
                  alt={mainImage.alt_text || product.name}
                  width={500}
                  height={500}
                  className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>

            <div className="mt-3">
              <h2 className="text-lg font-semibold">{product.name}</h2>

              <p className="mt-1 text-sm text-gray-500">
                {product.category.name}
              </p>

              {product.variants.length > 0 && (
                <p className="mt-2 font-medium">
                  From ${product.variants[0].price}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};
