import Link from "next/link";
import { Container } from "./ui/Container";
import ProductCard from "./ProductCard";
import { Product } from "@/app/types/product";
import ProductCard1 from "./ProductCard1";

interface BestSellingProps {
  products: Product[];
}

const BestSelling = ({ products }: BestSellingProps) => {
  console.log("asdf", products);
  return (
    <section className="py-16 md:py-20">
      <Container>
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm text-neutral-500">Our favorites</p>

            <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
              Best Sellers
            </h2>
          </div>

          <Link
            href="/products"
            className="text-sm font-medium underline underline-offset-4"
          >
            View all
          </Link>
        </div>

        {/* <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div> */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard1 key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default BestSelling;
