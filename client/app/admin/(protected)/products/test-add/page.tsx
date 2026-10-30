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
import { ProductForm } from "@/components/admin/ProductForm";

export default function AddProductPage() {
  // const { axios } = useAxios();

  // const [categories, setCategories] = useState<Category[]>([]);
  // const [colors, setColors] = useState<Color[]>([]);
  // const [sizes, setSizes] = useState<Size[]>([]);
  // useEffect(() => {
  //   const fetchOptions = async () => {
  //     try {
  //       const [categoriesResponse, colorsResponse, sizesResponse] =
  //         await Promise.all([
  //           axios.get("/category"),
  //           axios.get("/color"),
  //           axios.get("/size"),
  //         ]);

  //       setCategories(categoriesResponse.data);
  //       setColors(colorsResponse.data);
  //       setSizes(sizesResponse.data);
  //     } catch (error) {
  //       console.error("Failed to fetch product options:", error);
  //     }
  //   };

  //   fetchOptions();
  // }, [axios]);

  // const [isSubmitting, setIsSubmitting] = useState(false);

  // const form = useForm<CreateProductFormData>({
  //   resolver: zodResolver(createProductSchema),

  //   defaultValues: {
  //     name: "",
  //     slug: "",
  //     description: "",
  //     category_id: 0,

  //     images: [],

  //     variants: [
  //       {
  //         color_id: null,
  //         size_id: null,
  //         sku: "",
  //         price: 0,
  //         stock: 0,
  //         images: [],
  //       },
  //     ],
  //   },
  // });

  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   formState: { errors },
  // } = form;

  // // -----------------------------
  // // Product images
  // // -----------------------------

  // const {
  //   fields: imageFields,
  //   append: appendImage,
  //   remove: removeImage,
  // } = useFieldArray({
  //   control,
  //   name: "images",
  // });

  // // -----------------------------
  // // Variants
  // // -----------------------------

  // const {
  //   fields: variantFields,
  //   append: appendVariant,
  //   remove: removeVariant,
  // } = useFieldArray({
  //   control,
  //   name: "variants",
  // });

  // // -----------------------------
  // // Submit
  // // -----------------------------

  // const onSubmit = async (data: CreateProductFormData) => {
  //   setIsSubmitting(true);

  //   try {
  //     const payload = {
  //       ...data,

  //       images: data.images.map((image, index) => ({
  //         ...image,
  //         position: index,
  //       })),

  //       variants: data.variants.map((variant) => ({
  //         ...variant,

  //         images: variant.images.map((image, index) => ({
  //           ...image,
  //           position: index,
  //         })),
  //       })),
  //     };

  //     const response = await axios.post("/product", payload);

  //     console.log("Product created:", response.data);

  //     form.reset();
  //   } catch (error) {
  //     console.error("Failed to create product:", error);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  return (
    <div>
      <ProductForm mode="create" />
    </div>
  );
}
