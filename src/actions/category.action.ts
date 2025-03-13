/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "@/lib/db";
import { getUser } from "./user.action";
import { categoryZod } from "@/validations/category.zod";
import { revalidateTag } from "next/cache";

export async function createCategory(data: categoryZod) {
  try {
    const user = await getUser();
    if (!user) throw new Error("User not found");
    if (user.role !== "ADMIN")
      throw new Error("Not authorized to create category");
    revalidateTag("categories");

    return await prisma.category.create({ data });
  } catch (error: any) {
    console.error(error.message);
    throw new Error(error.message);
  }
}

export async function updateCategory({
  data,
  id,
}: {
  id: string;
  data: categoryZod;
}) {
  try {
    const user = await getUser();
    if (!user) throw new Error("User not found");
    if (user.role !== "ADMIN")
      throw new Error("Not authorized to update category");

    const category = await prisma.category.update({ where: { id }, data });
    revalidateTag("categories");
    return category;
  } catch (error: any) {
    console.error(error.message);
    throw new Error(error.message);
  }
}

export async function deleteCategory(id: string) {
  try {
    const user = await getUser();
    if (!user) throw new Error("User not found");
    if (user.role !== "ADMIN")
      throw new Error("Not authorized to delete category");

    revalidateTag("categories");
    return await prisma.category.delete({ where: { id } });
  } catch (error: any) {
    console.error(error.message);
    throw new Error(error.message);
  }
}

export async function getAllCategories() {
  try {
    return await prisma.category.findMany();
  } catch (error: any) {
    console.error(error.message);
    throw new Error(error.message);
  }
}
