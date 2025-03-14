/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cachedUser } from "@/lib/cache/user.cache";
import prisma from "@/lib/db";
import { productZod } from "@/validations/product.zod";
import { revalidateTag } from "next/cache";

export async function createProduct(data: productZod) {
  try {
    const user = await cachedUser();
    const isAdmin = user?.role === "ADMIN";
    if (!isAdmin) throw new Error("User unauthorized ");

    const product = await prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        slug: data.slug,
        brand: data.brand,
        categoryId: data.categoryId,
        description: data.description,
        discount: data.discount,
        images: data.images,
        isFeatured: data.isFeatured,
        quantity: data.quantity,
        status: data.status,
      },
    });

    revalidateTag("products");
    return product;
  } catch (error: any) {
    console.error("Error while creating product:", error);
    throw new Error("Failed to create product. Please try again.");
  }
}

export async function updateProduct({
  data,
  id,
}: {
  data: productZod;
  id: string;
}) {
  try {
    const user = await cachedUser();
    const isAdmin = user?.role === "ADMIN";
    if (!isAdmin) throw new Error("User unauthorized ");
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        price: data.price,
        slug: data.slug,
        brand: data.brand,
        categoryId: data.categoryId,
        description: data.description,
        discount: data.discount,
        images: data.images,
        isFeatured: data.isFeatured,
        quantity: data.quantity,
        status: data.status,
      },
    });
    revalidateTag("products");
    return product;
  } catch (error) {
    console.error("Error while updating product:", error);
    throw new Error("Failed to update product. Please try again.");
  }
}
