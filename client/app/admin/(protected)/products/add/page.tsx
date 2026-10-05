"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createProductSchema,
  CreateProductFormData,
} from "@/schemas/product.schema";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAxios } from "@/app/lib/axios";
import { Category, Color, Size } from "@/app/types/product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddProductPage() {
  const { axios } = useAxios();

  const [categories, setCategories] = useState<Category[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [categoriesResponse, colorsResponse, sizesResponse] =
          await Promise.all([
            axios.get("/category"),
            axios.get("/color"),
            axios.get("/size"),
          ]);

        setCategories(categoriesResponse.data);
        setColors(colorsResponse.data);
        setSizes(sizesResponse.data);
      } catch (error) {
        console.error("Failed to fetch product options:", error);
      }
    };

    fetchOptions();
  }, [axios]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),

    defaultValues: {
      name: "",
      slug: "",
      description: "",
      category_id: 0,

      images: [],

      variants: [
        {
          color_id: null,
          size_id: null,
          sku: "",
          price: 0,
          stock: 0,
          images: [],
        },
      ],
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  // -----------------------------
  // Product images
  // -----------------------------

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: "images",
  });

  // -----------------------------
  // Variants
  // -----------------------------

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  // -----------------------------
  // Submit
  // -----------------------------

  const onSubmit = async (data: CreateProductFormData) => {
    setIsSubmitting(true);

    try {
      const payload = {
        ...data,

        images: data.images.map((image, index) => ({
          ...image,
          position: index,
        })),

        variants: data.variants.map((variant) => ({
          ...variant,

          images: variant.images.map((image, index) => ({
            ...image,
            position: index,
          })),
        })),
      };

      const response = await axios.post("/product", payload);

      console.log("Product created:", response.data);

      form.reset();
    } catch (error) {
      console.error("Failed to create product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Add Product</h1>

        <p className="text-sm text-muted-foreground">
          Create a new product and its variants.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* -------------------------------- */}
        {/* BASIC PRODUCT INFORMATION */}
        {/* -------------------------------- */}

        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Product Name</label>

              <Input {...register("name")} placeholder="Classic Denim Pants" />

              {errors.name && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Slug</label>

              <Input {...register("slug")} placeholder="classic-denim-pants" />

              {errors.slug && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.slug.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>

              <Textarea
                {...register("description")}
                placeholder="Product description..."
              />

              {errors.description && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>

              <Select
                value={
                  form.watch("category_id")
                    ? String(form.watch("category_id"))
                    : ""
                }
                onValueChange={(value) => {
                  form.setValue("category_id", Number(value), {
                    shouldValidate: true,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.category_id && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.category_id.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* -------------------------------- */}
        {/* PRODUCT IMAGES */}
        {/* -------------------------------- */}

        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {imageFields.map((field, index) => (
              <div key={field.id} className="flex gap-3">
                <Input
                  {...register(`images.${index}.url`)}
                  placeholder="Image URL"
                />

                <Input
                  {...register(`images.${index}.alt_text`)}
                  placeholder="Alt text"
                />

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeImage(index)}
                >
                  Remove
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendImage({
                  url: "",
                  alt_text: "",
                  position: 0,
                })
              }
            >
              Add Image
            </Button>
          </CardContent>
        </Card>

        {/* -------------------------------- */}
        {/* VARIANTS */}
        {/* -------------------------------- */}

        <Card>
          <CardHeader>
            <CardTitle>Product Variants</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {variantFields.map((variant, index) => {
              const selectedColor = form.watch(`variants.${index}.color_id`);

              const selectedSize = form.watch(`variants.${index}.size_id`);
              return (
                <div
                  key={variant.id}
                  className="rounded-lg border p-4 space-y-4"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Color ID</label>

                      <Select
                        value={
                          selectedColor !== null ? String(selectedColor) : ""
                        }
                        onValueChange={(value) => {
                          form.setValue(
                            `variants.${index}.color_id`,
                            Number(value),
                            {
                              shouldValidate: true,
                            },
                          );
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>

                        <SelectContent>
                          {colors.map((color) => (
                            <SelectItem key={color.id} value={String(color.id)}>
                              {color.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Size</label>

                      <Select
                        value={
                          selectedSize !== null && selectedSize !== undefined
                            ? String(selectedSize)
                            : ""
                        }
                        onValueChange={(value) => {
                          form.setValue(
                            `variants.${index}.size_id`,
                            value ? Number(value) : null,
                            {
                              shouldValidate: true,
                            },
                          );
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>

                        <SelectContent>
                          {sizes.map((size) => (
                            <SelectItem key={size.id} value={String(size.id)}>
                              {size.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">SKU</label>

                      <Input
                        {...register(`variants.${index}.sku`)}
                        placeholder="DEN-BLU-M"
                      />

                      {errors.variants?.[index]?.sku && (
                        <p className="mt-1 text-sm text-destructive">
                          {errors.variants[index]?.sku?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium">Price</label>

                      <Input
                        type="number"
                        step="0.01"
                        {...register(`variants.${index}.price`)}
                        placeholder="49.99"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Stock</label>

                      <Input
                        type="number"
                        {...register(`variants.${index}.stock`, {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeVariant(index)}
                  >
                    Remove Variant
                  </Button>
                </div>
              );
            })}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendVariant({
                  color_id: null,
                  size_id: null,
                  sku: "",
                  price: 0,
                  stock: 0,
                  images: [],
                })
              }
            >
              Add Variant
            </Button>
          </CardContent>
        </Card>

        {/* -------------------------------- */}
        {/* SUBMIT */}
        {/* -------------------------------- */}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Product"}
        </Button>
      </form>
    </div>
  );
}
