"use client";

import { Product } from "@/app/types/product";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useAxios } from "@/app/lib/axios";
import { useRouter } from "next/navigation";

interface ProductsTableProps {
  products: Product[];
}

const ProductsTable = ({ products }: ProductsTableProps) => {
  const { axios } = useAxios();
  const router = useRouter();

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;

    try {
      await axios.delete(`/product/${id}`);

      console.log("Product deleted successfully");

      router.refresh();
    } catch (error: any) {
      console.error(
        "Failed to delete product:",
        error.response?.data?.message || error,
      );
    }
  };
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => {
              const image = product.images.sort(
                (a, b) => a.position - b.position,
              )[0];

              return (
                <TableRow key={product.id}>
                  {/* Product Image */}
                  <TableCell>
                    {image ? (
                      <Image
                        src={image.url}
                        alt={image.alt_text ?? product.name}
                        width={50}
                        height={50}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
                        No image
                      </div>
                    )}
                  </TableCell>

                  <TableCell>{product.id}</TableCell>

                  <TableCell className="font-medium">{product.name}</TableCell>

                  <TableCell>
                    {product.category?.name ?? "Uncategorized"}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {product.slug}
                  </TableCell>

                  <TableCell>
                    {new Date(product.created_at).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="sm">
                            Actions
                          </Button>
                        }
                      />

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          render={
                            <Link href={`/admin/products/${product.id}`} />
                          }
                        >
                          View
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          render={
                            <Link href={`/admin/products/${product.id}/edit`} />
                          }
                        >
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          render={
                            <Link
                              href={`/admin/products/${product.id}/variants/new`}
                            />
                          }
                        >
                          Add Variant
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          render={
                            <Link
                              href={`/admin/products/${product.id}/images/new`}
                            />
                          }
                        >
                          Add Image
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(product.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductsTable;
