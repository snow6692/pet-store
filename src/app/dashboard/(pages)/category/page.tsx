import { getAllCategories } from "@/actions/category.action";
import CategoryTable from "@/components/tables/CategoryTable";

async function CategoryPage() {
  const categories = await getAllCategories();

  return <CategoryTable categories={categories} />;
}

export default CategoryPage;
