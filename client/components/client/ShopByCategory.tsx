import Image from "next/image";
import Link from "next/link";
import { Container } from "./ui/Container";
import { Category } from "@/app/types/category";

interface ShopByCategoryProps {
  categories: Category[];
}

const ShopByCategory = ({ categories }: ShopByCategoryProps) => {
  const activeCategories = categories.filter(
    (category) => category.is_active && !category.deleted_at,
  );

  return (
    <section className="py-16 md:py-20">
      <Container>
        <h2 className="mb-8 text-2xl font-medium tracking-tight md:text-3xl">
          Shop By
        </h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {activeCategories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                {category.image_url ? (
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-neutral-500">
                    No image available
                  </div>
                )}
              </div>

              <h3 className="mt-3 text-sm font-medium md:text-base">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ShopByCategory;
