import ProductPagination from "@/components/pagination/ProductPagination ";
import ProductsTableComponent from "@/components/tables/ProductsTableComponent";
import { getCachedProducts } from "@/lib/cache/product.cache";
import { notFound } from "next/navigation";
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
    return notFound();
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
