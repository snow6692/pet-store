/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cachedUser } from "@/lib/cache/user.cache";
import prisma from "@/lib/db";
import { revalidateTag } from "next/cache";

export async function addToCart({
  productId,
  quantity = 1,
}: {
  productId: string;
  quantity: number;
}) {
  try {
    const user = await cachedUser();
    if (!user) throw new Error("User not authenticated");

    const userId = user.id;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new Error("Product not found");

    //Create cat if not exists
    const cart = await prisma.cart.upsert({
      where: { userId },
      create: {
        userId,
      },
      update: {},
    });

    //Check if the item in the cart
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });
    //Increment
    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: { increment: quantity } },
      });
    } else {
      //      Add item if not exists
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    revalidateTag("cart");
    return { success: true, message: "Product added to cart" };
  } catch (error: any) {
    console.error("Error adding to cart:", error);
    return { success: false, message: error.message };
  }
}
