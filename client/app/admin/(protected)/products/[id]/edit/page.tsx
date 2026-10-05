"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { ProductForm } from "@/components/admin/ProductForm";
import type { Product } from "@/app/types/product";
import { useAxios } from "@/app/lib/axios";

export default function UpdateProductPage() {
  const params = useParams();
  const { axios } = useAxios();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/product/${params.id}`);

        setProduct(response.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return <div className="p-6">Loading product...</div>;
  }

  if (!product) {
    return <div className="p-6">Product not found.</div>;
  }

  return <ProductForm mode="edit" initialData={product} />;
}
