"use client";

import { useAxios } from "@/app/lib/axios";
import { Category } from "@/app/types/product";
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
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  // ---------------------------------------------
  // Load existing category when editing
  // ---------------------------------------------

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        name: initialData.name,
      });
    }
  }, [mode, initialData, reset]);

  // ---------------------------------------------
  // Submit
  // ---------------------------------------------

  const onSubmit = async (data: CreateCategoryFormData) => {
    try {
      // CREATE
      if (mode === "create") {
        const response = await axios.post("/category", data);

        console.log("Category created:", response.data);

        // Reset form
        reset({
          name: "",
        });

        // Success message
        toast.success("Category created successfully", {
          description: `"${data.name}" has been added to your categories.`,
        });

        return;
      }

      // UPDATE
      if (!initialData) {
        toast.error("Category data is missing.");
        return;
      }

      const response = await axios.patch(`/category/${initialData.id}`, data);

      console.log("Category updated:", response.data);

      toast.success("Category updated successfully", {
        description: `"${data.name}" has been updated.`,
      });
    } catch (error: any) {
      console.error(
        mode === "create"
          ? "Failed to create category:"
          : "Failed to update category:",
        error,
      );

      const message =
        error.response?.data?.message ||
        (mode === "create"
          ? "Failed to create category."
          : "Failed to update category.");

      toast.error("Something went wrong", {
        description: message,
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
          {mode === "edit" ? "Update the category." : "Create a new category."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium">Category Name</label>

              <Input {...register("name")} placeholder="Pants, T-Shirt..." />

              {errors.name && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
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
