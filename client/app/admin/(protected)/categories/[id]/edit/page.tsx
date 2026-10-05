"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import type { Category } from "@/app/types/product";
import { useAxios } from "@/app/lib/axios";
import CategoryForm from "@/components/admin/CategoryForm";

export default function UpdateProductPage() {
  const params = useParams();
  const { axios } = useAxios();

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        console.log("id", params.id);
        const response = await axios.get(`/category/${params.id}`);

        setCategory(response.data);
      } catch (error) {
        console.error("Failed to fetch category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [params.id]);

  if (loading) {
    return <div className="p-6">Loading category...</div>;
  }

  if (!category) {
    return <div className="p-6">Category not found.</div>;
  }

  return <CategoryForm mode="edit" initialData={category} />;
}
