// app/(main)/products/page.tsx
import { getProductsByCategory } from "@/actions/category.action";
import ProductCard from "@/components/cards/ProductCard";

type Props = {
  searchParams: {
    category?: string;
  };
};

export default async function ProductsPage({ searchParams }: Props) {
  const category = (await searchParams).category || "all";

  const products = await getProductsByCategory(category);

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
}
