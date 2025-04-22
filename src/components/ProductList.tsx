import { ProductWithCategoriesTable } from "@/lib/types/product.types";
import ProductCard from "./cards/ProductCard";
import ProductCardSkeleton from "./cards/ProductCardSkeleton";

interface ProductsList {
  products: ProductWithCategoriesTable[];
}

function ProductList({ products }: ProductsList) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="transition-transform duration-300 hover:scale-105"
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}

// Static skeleton for use in Suspense boundaries
ProductList.Skeleton = function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default ProductList;
