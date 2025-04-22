/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing Stripe signature or secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;

    if (!metadata?.userId || !metadata?.orderData) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const userId = metadata.userId;
    const { name, email, phone, address, city, state, country, postalCode } =
      JSON.parse(metadata.orderData);

    try {
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: { items: { include: { product: true } } },
      });

      if (!cart || cart.items.length === 0) {
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
      }

      const totalPrice = cart.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      const order = await prisma.order.create({
        data: {
          userId,
          totalPrice,
          paymentMethod: "VISA",
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
      revalidateTag("my-orders");

      return NextResponse.json({ success: true, orderId: order.id });
    } catch (error: any) {
      console.error("Error processing webhook:", error);
      return NextResponse.json(
        { error: "Failed to process order" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
