// "use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import { config } from "@/lib/envConfig";
import { useCartTotal } from "@/hooks/CartTotalContext";

const stripePromise = loadStripe(config.stripe.public);

function PaymentDialog({
  children,
  onSuccess,
}: {
  children: React.ReactNode;
  onSuccess: () => void; //
}) {
  const totalPrice = useCartTotal();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice * 100 }),
      });

      if (!response.ok) throw new Error("Failed to create checkout session");
      return response.json();
    },
    onSuccess: async (session) => {
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: session.id,
        });

        if (!error) {
          onSuccess(); // بعد نجاح الدفع، استدعِ onSubmit لإنشاء الطلب
        } else {
          console.error(error);
        }
      }
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Visa Payment</DialogTitle>
        </DialogHeader>
        <p className="text-gray-600">
          Click the button below to proceed with Visa payment.
        </p>
        <Button
          onClick={() => mutate()}
          disabled={isPending}
          className="w-full bg-green-500 hover:bg-green-600"
        >
          {isPending ? "Processing..." : `Pay $${totalPrice}`}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default PaymentDialog;
