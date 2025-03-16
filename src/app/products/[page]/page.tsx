import ProductHomePagination from "@/components/pagination/ProductHomePagination";
import ProductList from "@/components/shared/ProductList";
import { getCachedProducts } from "@/lib/cache/product.cache";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

async function ProductPage({ params }: { params: Promise<{ page: string }> }) {
  const page = parseInt((await params).page);
  const limit = 10;

  const data = await getCachedProducts(page, limit);
  if (!data || !data.products || data.products.length === 0) {
    return notFound();
  }

  return (
    <div>
      <ProductList products={data.products} />
      <div className=" mt-10">
        <Suspense fallback={<p>Loading pagination...</p>}>
          <ProductHomePagination page={page} totalPages={data.pages} />
        </Suspense>
      </div>
    </div>
  );
}

export default ProductPage;
