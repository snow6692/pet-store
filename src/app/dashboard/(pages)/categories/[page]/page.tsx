import CategoryPagination from "@/components/pagination/CategoryPagination";
import CategoryTable from "@/components/tables/CategoryTable";
import { getCachedCategories } from "@/lib/cache/category.cache";
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
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold">No Categories Found</h1>
        <p className="text-gray-400">
          There are no categories available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div>
      <CategoryTable categories={data.categories} />
      <div className="mt-10">
        <Suspense fallback={<p>Loading pagination...</p>}>
          <CategoryPagination page={page} totalPages={data.pages} />
        </Suspense>
      </div>
    </div>
  );
}

export default CategoryPaginationPage;
