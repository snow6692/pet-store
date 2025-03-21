"use server";

import prisma from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { orderZod } from "@/validations/order.zod";
import { cachedUser } from "@/lib/cache/user.cache";
import { OrderStatus } from "@prisma/client";

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
    revalidatePath("/my-orders/1");
    revalidatePath("/dashboard/orders/1");

    revalidateTag("products");

    return { success: "Order placed successfully!", order };
  } catch (error) {
    console.error("Error placing order:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function getMyOrders({
  page = 1,
  limit = 10,
  isAdmin,
}: {
  page: number;
  limit: number;
  isAdmin?: boolean;
}) {
  const skip = (page - 1) * limit;

  const user = await cachedUser();
  if (!user) return { error: "You must be logged in" };
  const userId = user.id;
  const myOrders = await prisma.order.findMany({
    take: limit,
    skip,
    where: isAdmin
      ? {}
      : {
          userId,
        },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  const total = await prisma.order.count();
  return {
    myOrders,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
) {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });
    return updatedOrder;
  } catch (error) {
    console.error("Error updating order status:", error);
    return null;
  }
}
