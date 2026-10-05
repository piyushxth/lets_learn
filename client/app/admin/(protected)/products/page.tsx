import { Product } from "@/app/types/product";

import ProductsTable from "@/components/client/ProductsTable";

const ProductsPage = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const products: Product[] = await response.json();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>

        <p className="text-sm text-muted-foreground">
          Manage your products and inventory.
        </p>
      </div>

      <ProductsTable products={products} />
    </div>
  );
};

export default ProductsPage;
