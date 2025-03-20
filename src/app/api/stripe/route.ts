import { config } from "@/lib/envConfig";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(config.stripe.secret, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: Request) {
  try {
    const { amount, currency = "usd" } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: "Your Product",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error("Stripe Error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
