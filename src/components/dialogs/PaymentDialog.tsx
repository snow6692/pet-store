/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { placeOrder } from "@/actions/order.action";

const stripePromise = loadStripe(config.stripe.public);

function PaymentDialog({
  children,
  orderData, // البيانات القادمة من CheckoutForm
  onSuccess,
}: {
  children: React.ReactNode;
  orderData: any;
  onSuccess: () => void;
}) {
  const totalPrice = useCartTotal();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      sessionStorage.setItem("pendingOrder", JSON.stringify(orderData)); // ✅ حفظ الطلب مؤقتًا
      const response = await placeOrder(orderData); // ✅ استدعاء السيرفر أكشن

      console.log("Server Action Response:", response); // ✅ التحقق من الاستجابة

      if (response.error) throw new Error(response.error);
      return response;
    },
    onSuccess: async (data) => {
      if (data.sessionId) {
        const stripe = await stripePromise;
        if (!stripe) {
          console.error("Stripe failed to load");
          return;
        }

        console.log("Redirecting to Stripe with session ID:", data.sessionId);

        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (error) {
          console.error("Stripe Checkout error:", error.message);
        } else {
          onSuccess();
        }
      } else {
        console.log("Order placed successfully without Stripe.");
        onSuccess();
      }
    },
    onError: (error) => {
      console.error("Mutation error:", error.message);
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Visa Payment</DialogTitle>
        </DialogHeader>
        <p className="text-gray-600">Proceed with Visa payment.</p>
        <Button onClick={() => mutate()} disabled={isPending}>
          {isPending ? "Processing..." : `Pay $${totalPrice}`}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default PaymentDialog;
