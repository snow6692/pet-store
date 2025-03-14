import ProductForm from "@/components/forms/ProductForm";
import { getCachedCategories } from "@/lib/cache/category.cache";
import React from "react";

async function NewProductPage() {
  const data = await getCachedCategories();
  return <ProductForm categories={data.categories} />;
}

export default NewProductPage;
