import { Product } from "@/app/types/product";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

const colorClasses: Record<string, string> = {
  black: "bg-black",
  white: "bg-white",
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  gray: "bg-gray-500",
  grey: "bg-gray-500",
  charcoal: "bg-gray-800",
  ash: "bg-gray-300",
  magma: "bg-red-700",
};

const ProductCard1 = ({ product }: ProductCardProps) => {
  // Get the main product image
  const image = [...product.images].sort((a, b) => a.position - b.position)[0];

  // Get unique colors from product variants
  const colors = product.variants
    .map((variant) => variant.color)
    .filter(
      (color, index, self): color is NonNullable<typeof color> =>
        color !== null &&
        self.findIndex((item) => item?.id === color.id) === index,
    );

  return (
    <article>
      <Link href={`/products/${product.id}`} className="group block">
        {/* Product image */}
        <div className="order-2 aspect-square overflow-hidden bg-[#f5f5f5]">
          {image && (
            <Image
              src={image.url}
              alt={image.alt_text || product.name}
              width={600}
              height={600}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>

        {/* Product color options - visual only */}
        {colors.length > 0 && (
          <div className="order-3 flex items-end pt-2">
            <ul className="flex gap-2">
              {colors.map((color) => (
                <li
                  key={color.id}
                  title={color.name}
                  aria-label={color.name}
                  className={`h-6 w-6 rounded-sm border border-gray-300 ${
                    colorClasses[color.name.toLowerCase()] ?? "bg-gray-200"
                  }`}
                />
              ))}
            </ul>
          </div>
        )}

        {/* Product information */}
        <div className="order-4 flex grow flex-col gap-[6px] pt-2 min-[1100px]:pt-4">
          <h3 className="font-medium">{product.name}</h3>

          {/* Static reviews for now */}
          <div>
            <span aria-label="5 out of 5 stars">★★★★★</span>
            <span className="text-sm"> (75 reviews)</span>
          </div>

          {/* Static price for now */}
          <div>
            <span className="text-sm text-neutral-600">Rs. 31,100</span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard1;
