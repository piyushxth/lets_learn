import { useAxios } from "../lib/axios";
import { Product } from "../types/product";

const { axios } = useAxios();

export async function getProducts(): Promise<Product[]> {
  const response = await axios.get<Product[]>("/product");

  return response.data;
}

export async function getProductById(id: number): Promise<Product> {
  const response = await axios.get<Product>(`/product/${id}`);
  console.log(response);
  return response.data;
}
