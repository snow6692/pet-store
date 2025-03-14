import PaginationControls from "@/components/shared/PaginationControls";
import CategoryTable from "@/components/tables/CategoryTable";
import { getCachedCategories } from "@/lib/cache/category.cache";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

async function CategoryPaginationPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const page = parseInt((await params).page);
  const limit = 10;
  const data = await getCachedCategories(page, limit);
  if (!data || !data.categories || data.categories.length === 0) {
    return notFound();
  }
  return (
    <div>
      <CategoryTable categories={data.categories} />
      <div className=" mt-10">
        <Suspense fallback={<p>Loading pagination...</p>}>
          <PaginationControls page={page} totalPages={data.pages} />
        </Suspense>
      </div>
    </div>
  );
}

export default CategoryPaginationPage;
