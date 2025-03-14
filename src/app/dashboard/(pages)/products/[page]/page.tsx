import PaginationControls from "@/components/shared/PaginationControls";
import ProductsTableComponent from "@/components/tables/ProductsTableComponent";
import { getCachedProducts } from "@/lib/cache/product.cache";
import React, { Suspense } from "react";

async function ProductsTablePage({ params }: { params: { page: string } }) {
  const page = Number(params.page) || 1;
  const data = await getCachedProducts();

  return (
    <div>
      <ProductsTableComponent products={data.products} />;
      <div className=" mt-10">
        <Suspense fallback={<p>Loading pagination...</p>}>
          <PaginationControls page={page} totalPages={data.pages} />
        </Suspense>
      </div>
    </div>
  );
}

export default ProductsTablePage;
