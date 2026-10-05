import { useAxios } from "../lib/axios";
import { ListProducts } from "@/components/client/ListProducts";

export default async function Home() {
  const { axios } = useAxios();

  const { data } = await axios.get(`/product`);
  return (
    <div className="">
      <ListProducts products={data} />
    </div>
  );
}
