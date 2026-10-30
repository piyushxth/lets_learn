import { useAxios } from "../lib/axios";
import Hero from "@/components/client/Hero";
import ShopByCategory from "@/components/client/ShopByCategory";
import BestSelling from "@/components/client/BestSelling";
import { Product } from "../types/product";
import { Category } from "../types/category";
import Banner from "@/components/client/Banner";

export default async function Home() {
  const { axios } = useAxios();

  const [productsResponse, categoriesResponse] = await Promise.all([
    axios.get<Product[]>("/product"),
    axios.get<Category[]>("/category"),
  ]);

  const products = productsResponse.data;
  const categories = categoriesResponse.data;

  return (
    <main className="">
      <Hero />
      <ShopByCategory categories={categories} />
      <Banner />
      <BestSelling products={products} />
    </main>
  );
}
