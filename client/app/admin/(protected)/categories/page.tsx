import { Category } from "@/app/types/product";
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

const page = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch category");
  }

  const categories: Category[] = await response.json();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Categories</h1>

        <p className="text-sm text-muted-foreground">Manage your categories.</p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => {
                return (
                  <TableRow key={category.id}>
                    {/* Product Image */}

                    <TableCell>{category.id}</TableCell>

                    <TableCell className="font-medium">
                      {category.name}
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
                              <Link href={`/admin/categories/${category.id}`} />
                            }
                          >
                            View
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            render={
                              <Link
                                href={`/admin/categories/${category.id}/edit`}
                              />
                            }
                          >
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="text-destructive"
                            // onClick={() => handleDelete(product.id)}
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
    </div>
  );
};

export default page;
