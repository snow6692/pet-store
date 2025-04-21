import { getFeaturedProducts } from "@/actions/product.action";
import HomePage from "@/components/pages/HomePage";

export default async function Page() {
  const products = await getFeaturedProducts({ limit: 6 });

  return <HomePage products={products} />;
}
