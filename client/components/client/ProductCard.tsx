import { Product } from "@/app/types/product";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <article>
      <Link href={`/products/${product.id}`}>
        <h2>{product.name}</h2>

        {product.description && <p>{product.description}</p>}

        <p>Category: {product.category.name}</p>
      </Link>
    </article>
  );
};

export default ProductCard;
