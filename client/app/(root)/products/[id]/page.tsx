import Image from "next/image";
import { getProductById } from "@/app/services/product.service";

interface ProductDetailsPageProps {
  params: Promise<{ id: number }>;
}

const ProductDetailsPage = async ({ params }: ProductDetailsPageProps) => {
  const { id } = await params;

  const product = await getProductById(id);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      {/* PRODUCT HEADER */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* IMAGES */}
        <div>
          <div className="grid grid-cols-2 gap-4">
            {product.images.map((image) => (
              <div
                key={image.id}
                className="overflow-hidden rounded-lg bg-gray-100"
              >
                <Image
                  src={image.url}
                  alt={image.alt_text || product.name}
                  width={600}
                  height={600}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* PRODUCT INFORMATION */}
        <div>
          <p className="text-sm text-gray-500">{product.category.name}</p>

          <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>

          {product.description && (
            <p className="mt-4 text-gray-600">{product.description}</p>
          )}

          {/* VARIANTS */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Available Variants</h2>

            <div className="mt-4 space-y-4">
              {product.variants.map((variant) => (
                <div key={variant.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      {variant.color && (
                        <p>
                          Color: <strong>{variant.color.name}</strong>
                        </p>
                      )}

                      {variant.size && (
                        <p>
                          Size: <strong>{variant.size.name}</strong>
                        </p>
                      )}
                    </div>

                    <p className="text-lg font-semibold">${variant.price}</p>
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    SKU: {variant.sku}
                  </p>

                  <p className="mt-2 text-sm">
                    {variant.stock > 0 ? (
                      <span className="text-green-600">
                        {variant.stock} available
                      </span>
                    ) : (
                      <span className="text-red-600">Out of stock</span>
                    )}
                  </p>

                  {/* VARIANT IMAGES */}
                  {variant.images.length > 0 && (
                    <div className="mt-4 flex gap-3">
                      {variant.images.map((image) => (
                        <Image
                          key={image.id}
                          src={image.url}
                          alt={
                            image.alt_text ||
                            `${product.name} ${variant.color?.name ?? ""}`
                          }
                          width={100}
                          height={100}
                          className="rounded-md object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailsPage;
