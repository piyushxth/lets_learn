export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface OrderProduct {
  id: number;
  name: string;
  slug: string;
}

export interface OrderColor {
  id: number;
  name: string;
}

export interface OrderSize {
  id: number;
  name: string;
}

export interface OrderVariant {
  id: number;
  product_id: number;
  color_id: number | null;
  size_id: number | null;
  sku: string;
  price: string;
  stock: number;
  color: OrderColor | null;
  size: OrderSize | null;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  variant_id: number | null;

  quantity: number;

  unit_price: string;
  subtotal: string;

  product_name: string;
  variant_name: string | null;

  created_at: string;

  product: OrderProduct;
  variant: OrderVariant | null;
}

export interface Order {
  id: number;
  user_id: number;

  total: string;
  status: OrderStatus;

  deleted_at: string | null;

  created_at: string;
  updated_at: string;

  user: OrderUser;

  items: OrderItem[];
}
