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

export async function getPaginationProduct({
  page = 1,
  limit = 10,
}: {
  page: number;
  limit: number;
}) {
  const skip = (page - 1) * limit;
  try {
    const products = await prisma.product.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
      },
    });
    const total = await prisma.product.count();
    return {
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  } catch (error: any) {
    console.error(error.message);
    throw new Error(error.message);
  }
}

export async function deleteProduct(id: string) {
  try {
    const user = await cachedUser();
    if (!user) throw new Error("User not found");
    if (user.role !== "ADMIN")
      throw new Error("Not authorized to delete product");

    revalidateTag("products");
    return await prisma.product.delete({ where: { id } });
  } catch (error: any) {
    console.error(error.message);
    throw new Error(error.message);
  }
}

// Search and filters
export async function searchProducts({
  search,
  categoryId,
}: {
  search?: string;
  categoryId?: string;
}) {
  try {
    const products = await prisma.product.findMany({
      where: {
        AND: [
          search
            ? {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              }
            : {},
          categoryId
            ? {
                categoryId,
              }
            : {},
        ],
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return products;
  } catch (error: any) {
    console.error("Error searching products:", error.message);
    throw new Error("Something went wrong while searching products.");
  }
}

export async function getRelatedProducts(
  categoryName: string,
  productId: string
) {
  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          name: categoryName,
        },
        NOT: {
          id: productId, //
        },
      },
      take: 4, //
      include: {
        category: true,
      },
    });

    return products;
  } catch (error: any) {
    console.error(error.message);
    throw new Error(error.message);
  }
}
