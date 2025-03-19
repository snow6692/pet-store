"use server";

import prisma from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { orderZod } from "@/validations/order.zod";
import { cachedUser } from "@/lib/cache/user.cache";

export async function placeOrder(formData: orderZod) {
  const parsed = orderZod.safeParse(formData);
  if (!parsed.success) {
    return { error: "Invalid order data" };
  }

  const user = await cachedUser();
  if (!user) return { error: "You must be logged in" };

  const {
    name,
    email,
    phone,
    address,
    city,
    state,
    country,
    postalCode,
    payment,
  } = parsed.data;

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return { error: "Your cart is empty" };
    }

    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalPrice,
        paymentMethod: payment,
        status: "PENDING",
        address,
        phone,
        name,
        email,
        city,
        state,
        country,
        postalCode,
        items: {
          create: cart.items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    for (const item of cart.items) {
      await prisma.product.update({
        where: { id: item.product.id },
        data: { quantity: { decrement: item.quantity } },
      });
    }

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    revalidatePath("/cart");
    revalidateTag("products");

    return { success: "Order placed successfully!", order };
  } catch (error) {
    console.error("Error placing order:", error);
    return { error: "Something went wrong. Please try again." };
  }
}
