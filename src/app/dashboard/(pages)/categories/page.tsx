import CategoryTable from "@/components/tables/CategoryTable";
import { getCachedCategories } from "@/lib/cache/category.cache";

async function CategoryPage() {
  const categories = await getCachedCategories();

  return <CategoryTable categories={categories} />;
}

export default CategoryPage;
