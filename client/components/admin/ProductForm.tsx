"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, Color, Product, Size } from "@/app/types/product";
import {
  CreateProductFormData,
  createProductSchema,
} from "@/schemas/product.schema";
import { useAxios } from "@/app/lib/axios";
import { toast } from "sonner";

interface ProductFormProps {
  mode: "create" | "edit";
  initialData?: Product;
}

export function ProductForm({ mode, initialData }: ProductFormProps) {
  const { axios } = useAxios();
  // --------------------------------------------------
  // Options from database
  // --------------------------------------------------

  const [categories, setCategories] = useState<Category[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);

  const [loadingOptions, setLoadingOptions] = useState(true);

  // --------------------------------------------------
  // Form
  // --------------------------------------------------

  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),

    defaultValues: {
      name: "",
      slug: "",
      description: "",
      category_id: 0,
      images: [],
      variants: [],
    },
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  // --------------------------------------------------
  // Product images
  // --------------------------------------------------

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: "images",
  });

  // --------------------------------------------------
  // Product variants
  // --------------------------------------------------

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  // --------------------------------------------------
  // Fetch categories, colors and sizes
  // --------------------------------------------------

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);

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
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  // --------------------------------------------------
  // Populate form when editing
  // --------------------------------------------------

  useEffect(() => {
    if (!initialData) return;

    reset({
      name: initialData.name,

      slug: initialData.slug,

      description: initialData.description ?? "",

      category_id: initialData.category_id,

      images: initialData.images.map((image) => ({
        id: image.id,
        url: image.url,
        alt_text: image.alt_text ?? "",
        position: image.position,
      })),

      variants: initialData.variants.map((variant) => ({
        id: variant.id,

        color_id: variant.color_id,

        size_id: variant.size_id,

        sku: variant.sku,

        price: variant.price,

        stock: variant.stock,

        images: variant.images.map((image) => ({
          id: image.id,
          url: image.url,
          alt_text: image.alt_text ?? "",
          position: image.position,
        })),
      })),
    });
  }, [initialData, reset]);

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  const onSubmit = async (data: CreateProductFormData) => {
    try {
      if (mode === "create") {
        console.log("generated data", data);
        const productName = data.name;
        const response = await axios.post("/product", data);
        console.log("Product created:", response.data);

        toast.success("Product created successfully", {
          description: `"${productName}" has been added to your Products.`,
        });

        // Reset form to initial state after showing toast
        reset({
          name: "",
          slug: "",
          description: "",
          category_id: 0,
          images: [],
          variants: [],
        });

        return;
      }

      // ------------------------------------------------
      // UPDATE
      // ------------------------------------------------

      if (!initialData) {
        console.error("Cannot update product without product data.");

        return;
      }
      console.log("data", data);
      const response = await axios.patch(`/product/${initialData.id}`, data);
      toast.success("Product update successfully", {
        description: `"${data.name}" has been updated.`,
      });
      console.log("Product updated:", response.data);
    } catch (error: any) {
      console.error(
        mode === "create"
          ? "Failed to create product:"
          : "Failed to update product:",
        error,
      );

      const errorMessage =
        error?.response?.data?.message || error?.message || "Unknown error";
      const statusCode = error?.response?.status;

      console.error("Status:", statusCode);
      console.error("Error details:", error?.response?.data);

      toast.error(
        mode === "create"
          ? "Failed to create product"
          : "Failed to update product",
        {
          description: errorMessage,
        },
      );
    }
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loadingOptions) {
    return <div className="p-6">Loading product form...</div>;
  }
  return (
    <div className="p-6">
      {/* PAGE HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          {mode === "edit" ? "Edit Product" : "Add Product"}
        </h1>

        <p className="text-sm text-muted-foreground">
          {mode === "edit"
            ? "Update the product and its variants."
            : "Create a new product and its variants."}
        </p>
      </div>

      {/* FORM */}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* BASIC PRODUCT INFORMATION */}

        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Product Name */}

            <div>
              <label className="text-sm font-medium">Product Name</label>

              <Input {...register("name")} placeholder="Classic Denim Pants" />

              {errors.name && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Slug */}

            <div>
              <label className="text-sm font-medium">Slug</label>

              <Input {...register("slug")} placeholder="classic-denim-pants" />

              {errors.slug && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.slug.message}
                </p>
              )}
            </div>

            {/* Description */}

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

            {/* Category */}
            <div>
              <label className="text-sm font-medium">Category</label>

              <Select
                items={categories.map((category) => ({
                  value: String(category.id),
                  label: category.name,
                }))}
                value={
                  watch("category_id") > 0
                    ? String(watch("category_id"))
                    : undefined
                }
                onValueChange={(value) => {
                  setValue("category_id", Number(value), {
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

        {/* PRODUCT IMAGES */}

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
                  position: imageFields.length,
                })
              }
            >
              Add Image
            </Button>
          </CardContent>
        </Card>

        {/* =========================================== */}
        {/* VARIANTS */}
        {/* =========================================== */}

        <Card>
          <CardHeader>
            <CardTitle>Product Variants</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {variantFields.map((variant, index) => {
              const selectedColor = watch(`variants.${index}.color_id`);

              const selectedSize = watch(`variants.${index}.size_id`);

              return (
                <div
                  key={variant.id}
                  className="space-y-4 rounded-lg border p-4"
                >
                  {/* Variant fields */}

                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Color */}

                    <div>
                      <label className="text-sm font-medium">Color</label>

                      <Select
                        items={colors.map((color) => ({
                          value: String(color.id),
                          label: color.name,
                        }))}
                        value={
                          selectedColor !== null && selectedColor !== undefined
                            ? String(selectedColor)
                            : undefined
                        }
                        onValueChange={(value) => {
                          setValue(
                            `variants.${index}.color_id`,
                            value ? Number(value) : null,
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

                    {/* Size */}

                    <div>
                      <label className="text-sm font-medium">Size</label>

                      <Select
                        items={sizes.map((size) => ({
                          value: String(size.id),
                          label: size.name,
                        }))}
                        value={
                          selectedSize !== null && selectedSize !== undefined
                            ? String(selectedSize)
                            : undefined
                        }
                        onValueChange={(value) => {
                          setValue(
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

                    {/* SKU */}

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

                    {/* Price */}

                    <div>
                      <label className="text-sm font-medium">Price</label>

                      <Input
                        type="text"
                        {...register(`variants.${index}.price`, {
                          valueAsNumber: true,
                        })}
                        placeholder="49.99"
                      />
                      {errors.variants?.[index]?.price && (
                        <p className="mt-1 text-sm text-destructive">
                          {errors.variants[index]?.price?.message}
                        </p>
                      )}
                    </div>

                    {/* Stock */}

                    <div>
                      <label className="text-sm font-medium">Stock</label>

                      <Input
                        type="number"
                        {...register(`variants.${index}.stock`, {
                          valueAsNumber: true,
                        })}
                      />

                      {errors.variants?.[index]?.stock && (
                        <p className="mt-1 text-sm text-destructive">
                          {errors.variants[index]?.stock?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* -------------------------------- */}
                  {/* Variant Images */}
                  {/* -------------------------------- */}

                  <div className="space-y-3">
                    <label className="text-sm font-medium">
                      Variant Images
                    </label>

                    {(watch(`variants.${index}.images`) ?? []).map(
                      (_, imageIndex) => (
                        <div key={imageIndex} className="flex gap-3">
                          <Input
                            {...register(
                              `variants.${index}.images.${imageIndex}.url`,
                            )}
                            placeholder="Image URL"
                          />

                          <Input
                            {...register(
                              `variants.${index}.images.${imageIndex}.alt_text`,
                            )}
                            placeholder="Alt text"
                          />

                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => {
                              const images =
                                watch(`variants.${index}.images`) ?? [];

                              setValue(
                                `variants.${index}.images`,
                                images.filter((_, i) => i !== imageIndex),
                                {
                                  shouldValidate: true,
                                },
                              );
                            }}
                          >
                            Remove Image
                          </Button>
                        </div>
                      ),
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const images = watch(`variants.${index}.images`) ?? [];

                        setValue(
                          `variants.${index}.images`,
                          [
                            ...images,
                            {
                              url: "",
                              alt_text: "",
                              position: images.length,
                            },
                          ],
                          {
                            shouldValidate: true,
                          },
                        );
                      }}
                    >
                      Add Variant Image
                    </Button>
                  </div>

                  {/* Remove variant */}

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

            {/* Add variant */}

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

        {/* =========================================== */}
        {/* SUBMIT */}
        {/* =========================================== */}

        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={() => {
            console.log("🔥 BUTTON CLICKED");
            console.log("📦 VALUES:", form.getValues());
          }}
        >
          {isSubmitting
            ? mode === "edit"
              ? "Updating..."
              : "Creating..."
            : mode === "edit"
              ? "Update Product"
              : "Create Product"}
        </Button>
      </form>
    </div>
  );
}
