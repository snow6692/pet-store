import ProductPagination from "@/components/pagination/ProductPagination ";
import ProductsTableComponent from "@/components/tables/ProductsTableComponent";
import { getCachedProducts } from "@/lib/cache/product.cache";
import React, { Suspense } from "react";

async function ProductsTablePage({ params }: { params: { page: string } }) {
  const page = (await Number(params.page)) || 1;
  const data = await getCachedProducts();
 
  return (
    <div>
      <ProductsTableComponent
        products={data.products}
       
      />
      ;
      <div className=" mt-10">
        <Suspense fallback={<p>Loading pagination...</p>}>
          <ProductPagination page={page} totalPages={data.pages} />
        </Suspense>
      </div>
    </div>
  );
}

export default ProductsTablePage;
