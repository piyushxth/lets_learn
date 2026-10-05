import { useAxios } from "@/app/lib/axios";
import { ListProducts } from "@/components/client/ListProducts";

export default async function Home() {
  const { axios } = useAxios();

  const { data } = await axios.get(`/product`);
  return (
    <main className="">
      <ListProducts products={data} />
    </main>
  );
}
