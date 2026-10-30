import { Product } from "@/app/types/product";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Get the main product image
  const image = [...product.images].sort((a, b) => a.position - b.position)[0];

  // Get unique colors from product variants
  const colors = product.variants
    .map((variant) => variant.color)
    .filter(
      (color, index, self) =>
        color !== null &&
        self.findIndex((item) => item?.id === color.id) === index,
    );

  // Get the lowest variant price
  const prices = product.variants.map((variant) => variant.price);
  const price = prices.length > 0 ? Math.min(...prices) : null;

  return (
    <article>
      <Link href={`/products/${product.slug}`} className="group">
        {/* Product image */}
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt_text || product.name}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-neutral-400">
              No image available
            </div>
          )}
        </div>

        {/* Product details */}
        <div className="mt-3">
          {/* Color swatches */}
          {colors.length > 0 && (
            <div className="mb-2 flex gap-2">
              {colors.map((color) => (
                <span
                  key={color?.id}
                  title={color?.name}
                  className="size-5 rounded-full border border-neutral-300 bg-neutral-200"
                />
              ))}
            </div>
          )}

          <h3 className="text-sm font-medium">{product.name}</h3>

          <p className="mt-1 text-sm text-neutral-600">
            {price !== null ? `$${price.toFixed(2)}` : "Price unavailable"}
          </p>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;
