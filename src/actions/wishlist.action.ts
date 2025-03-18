/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cachedUser } from "@/lib/cache/user.cache";
import prisma from "@/lib/db";

export const addToWishlist = async (productId: string) => {
  try {
    const user = await cachedUser();
    if (!user) throw new Error("Not authenticated");

    const userId = user.id;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new Error("Product not found");

    const wishlist = await prisma.wishlist.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    const existingItem = await prisma.wishlistItem.findFirst({
      where: { wishlistId: wishlist.id, productId },
    });

    if (existingItem) {
      await prisma.wishlistItem.delete({
        where: { id: existingItem.id },
      });
    } else {
      await prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId,
        },
      });
    }
  } catch (error: any) {
    console.error("Wishlist Error:", error.message);
  }
};

export const getWishlist = async () => {
  try {
    const user = await cachedUser();
    if (!user) throw new Error("Not authenticated");
    const userId = user.id;

    return prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });
  } catch (error: any) {
    console.error("Wishlist Error:", error.message);
  }
};

export const removeAllWishlist = async () => {
  try {
    const user = await cachedUser();
    if (!user) throw new Error("Not authenticated");
    const userId = user.id;
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: { items: true },
    });
    if (!wishlist) return;

    return prisma.wishlistItem.deleteMany({
      where: { wishlistId: wishlist?.id },
    });
  } catch (error: any) {
    console.error("Wishlist Error:", error.message);
  }
};
