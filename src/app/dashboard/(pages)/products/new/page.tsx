import ProductForm from "@/components/forms/ProductForm";
import prisma from "@/lib/db";
import React from "react";

async function NewProductPage() {
  const categories = await prisma.category.findMany();
  return <ProductForm categories={categories} />;
}

export default NewProductPage;
