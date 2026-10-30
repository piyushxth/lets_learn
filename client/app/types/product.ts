import { Category } from "./category";

export type { Category } from "./category";

export interface Color {
  id: number;
  name: string;
}

export interface Size {
  id: number;
  name: string;
}

export interface ProductImage {
  id: number;
  url: string;
  alt_text: string | null;
  position: number;
  product_id: number | null;
  variant_id: number | null;
  created_at: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  color_id: number | null;
  size_id: number | null;
  sku: string;
  price: number;
  stock: number;
  created_at: string;
  updated_at: string;

  color: Color | null;
  size: Size | null;
  images: ProductImage[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  category_id: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
}
