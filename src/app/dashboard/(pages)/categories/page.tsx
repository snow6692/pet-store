import CategoryTable from "@/components/tables/CategoryTable";
import { getCachedCategories } from "@/lib/cache/category.cache";

async function CategoryPage() {
  const data = await getCachedCategories();

  if (!data || !data.categories) {
    return <p>No categories found.</p>; 
  }
  return <CategoryTable categories={data.categories} />;
}

export default CategoryPage;
