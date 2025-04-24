import ProductPagination from "@/components/pagination/ProductPagination ";
import ProductsTableComponent from "@/components/tables/ProductsTableComponent";
import { getCachedProducts } from "@/lib/cache/product.cache";
import React, { Suspense } from "react";

async function ProductsTablePage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const page = parseInt((await params).page);
  const limit = 10;

  const data = await getCachedProducts(page, limit);
  if (!data || !data.products || data.products.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold">No Products Found</h1>
        <p className="text-gray-400">
          There are no products available at the moment.
        </p>
      </div>
    );
  }
  return (
    <div>
      <ProductsTableComponent products={data.products} />;
      <div className=" mt-10">
        <Suspense fallback={<p>Loading pagination...</p>}>
          <ProductPagination page={page} totalPages={data.pages} />
        </Suspense>
      </div>
    </div>
  );
}

export default ProductsTablePage;
