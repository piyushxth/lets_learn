"use client";

import { useAxios } from "@/app/lib/axios";
import { Category } from "@/app/types/category";
import {
  CreateCategoryFormData,
  createCategorySchema,
} from "@/schemas/category.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";

interface CategoryFormProps {
  mode: "create" | "edit";
  initialData?: Category;
}

const CategoryForm = ({ mode, initialData }: CategoryFormProps) => {
  const { axios } = useAxios();

  const form = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      image_url: "",
      is_active: true,
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const name = watch("name");

  // Generate a URL-friendly slug from the category name.
  useEffect(() => {
    const slug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    setValue("slug", slug, { shouldValidate: true });
  }, [name, setValue]);

  // Load existing category when editing.
  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        name: initialData.name,
        slug: initialData.slug,
        description: initialData.description ?? "",
        image_url: initialData.image_url ?? "",
        is_active: initialData.is_active,
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = async (data: CreateCategoryFormData) => {
    try {
      const payload = {
        ...data,
        description: data.description || null,
        image_url: data.image_url || null,
      };

      if (mode === "create") {
        const response = await axios.post("/category", payload);

        console.log("Category created:", response.data);

        reset({
          name: "",
          slug: "",
          description: "",
          image_url: "",
          is_active: true,
        });

        toast.success("Category created successfully", {
          description: `"${data.name}" has been added to your categories.`,
        });

        return;
      }

      if (!initialData) {
        toast.error("Category data is missing.");
        return;
      }

      const response = await axios.patch(
        `/category/${initialData.id}`,
        payload,
      );

      console.log("Category updated:", response.data);

      toast.success("Category updated successfully", {
        description: `"${data.name}" has been updated.`,
      });
    } catch (error: unknown) {
      console.error(
        mode === "create"
          ? "Failed to create category:"
          : "Failed to update category:",
        error,
      );

      const message =
        typeof error === "object" && error !== null && "response" in error
          ? (
              error as {
                response?: { data?: { message?: string } };
              }
            ).response?.data?.message
          : undefined;

      toast.error("Something went wrong", {
        description:
          message ||
          (mode === "create"
            ? "Failed to create category."
            : "Failed to update category."),
      });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          {mode === "edit" ? "Edit Category" : "Add Category"}
        </h1>

        <p className="text-sm text-muted-foreground">
          {mode === "edit"
            ? "Update the category details."
            : "Create a new product category."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Category name */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Category Name
              </label>

              <Input {...register("name")} placeholder="Pants, T-Shirts..." />

              {errors.name && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Category Slug
              </label>

              <Input {...register("slug")} placeholder="t-shirts" />

              <p className="mt-1 text-xs text-muted-foreground">
                Generated automatically from the category name. You can edit it.
              </p>

              {errors.slug && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.slug.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Description
              </label>

              <Textarea
                {...register("description")}
                placeholder="Describe this category..."
                rows={4}
              />

              {errors.description && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Image URL */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Category Image URL
              </label>

              <Input
                {...register("image_url")}
                placeholder="https://images.unsplash.com/..."
              />

              {errors.image_url && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.image_url.message}
                </p>
              )}
            </div>

            {/* Active status */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <label className="text-sm font-medium">Active Category</label>
                <p className="text-xs text-muted-foreground">
                  Allow this category to appear in your storefront.
                </p>
              </div>

              <Switch
                checked={watch("is_active")}
                onCheckedChange={(checked) =>
                  setValue("is_active", checked, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? mode === "edit"
              ? "Updating..."
              : "Creating..."
            : mode === "edit"
              ? "Update Category"
              : "Create Category"}
        </Button>
      </form>
    </div>
  );
};

export default CategoryForm;
