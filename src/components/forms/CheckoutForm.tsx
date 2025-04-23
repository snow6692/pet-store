/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { cachedUser } from "@/lib/cache/user.cache";
import { useQuery } from "@tanstack/react-query";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { orderZod } from "@/validations/order.zod";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { placeOrder } from "@/actions/order.action";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { config } from "@/lib/envConfig";
import { Card } from "../ui/card";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const stripePromise = loadStripe(config.stripe.public);

interface CheckoutFormProps {
  onSubmit: (data: z.infer<typeof orderZod>) => Promise<void>;
}

export default function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const { data: user } = useQuery({ queryKey: ["user"], queryFn: cachedUser });

  const form = useForm<z.infer<typeof orderZod>>({
    resolver: zodResolver(orderZod),
    defaultValues: {
      email: user?.email || "",
      address: user?.address || "",
      name: user?.name || "",
      phone: user?.phone || "",
      postalCode: user?.postalCode || "",
      city: user?.city || "",
      state: user?.state || "",
      country: user?.country || "",
      payment: "CASH_ON_DELIVERY",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email || "",
        address: user.address || "",
        name: user.name || "",
        phone: user.phone || "",
        postalCode: user.postalCode || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        payment: "CASH_ON_DELIVERY",
      });
    }
  }, [user, form]);

  const handleSubmit = async (data: z.infer<typeof orderZod>) => {
    if (data.payment === "CASH_ON_DELIVERY") {
      await onSubmit(data);
    } else {
      try {
        const orderResponse = await placeOrder(data);
        if (orderResponse.sessionId) {
          const stripe = await stripePromise;
          if (!stripe) {
            toast.error("Stripe initialization failed.");
            return;
          }
          toast.loading("Redirecting to Stripe checkout...", {
            id: "stripe-redirect",
          });
          const { error } = await stripe.redirectToCheckout({
            sessionId: orderResponse.sessionId,
          });

          if (error) {
            toast.dismiss("stripe-redirect");
            toast.error(error.message || "Payment failed. Try again.");
          }
        } else {
          toast.error("Failed to initiate payment session.");
        }
      } catch (error: any) {
        toast.error("Payment failed. Try again.", error);
      }
    }
  };

  return (
    <Card className="p-6 border-none shadow-sm bg-background/95 backdrop-blur-sm">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-foreground">
                  Name
                </FormLabel>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    {...field}
                    placeholder="Full Name"
                    className="border-muted/50 focus:ring-2 focus:ring-primary/50"
                  />
                </motion.div>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-foreground">
                  Email
                </FormLabel>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    type="email"
                    {...field}
                    placeholder="Email Address"
                    className="border-muted/50 focus:ring-2 focus:ring-primary/50"
                  />
                </motion.div>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-foreground">
                  Phone
                </FormLabel>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    type="tel"
                    {...field}
                    placeholder="Phone Number"
                    className="border-muted/50 focus:ring-2 focus:ring-primary/50"
                  />
                </motion.div>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          {/* Payment Method */}
          <FormField
            control={form.control}
            name="payment"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel className="text-sm font-semibold text-foreground">
                  Payment Method
                </FormLabel>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="border-muted/50 focus:ring-2 focus:ring-primary/50">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH_ON_DELIVERY">
                        Cash on Delivery
                      </SelectItem>
                      <SelectItem value="VISA">Visa</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          {/* Address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel className="text-sm font-semibold text-foreground">
                  Address
                </FormLabel>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    {...field}
                    placeholder="Street Address"
                    className="border-muted/50 focus:ring-2 focus:ring-primary/50"
                  />
                </motion.div>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          {/* City */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-foreground">
                  City
                </FormLabel>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    {...field}
                    placeholder="City"
                    className="border-muted/50 focus:ring-2 focus:ring-primary/50"
                  />
                </motion.div>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          {/* Postal Code */}
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-foreground">
                  Postal Code
                </FormLabel>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    {...field}
                    placeholder="Postal Code"
                    className="border-muted/50 focus:ring-2 focus:ring-primary/50"
                  />
                </motion.div>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          {/* State */}
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-foreground">
                  State
                </FormLabel>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    {...field}
                    placeholder="State"
                    className="border-muted/50 focus:ring-2 focus:ring-primary/50"
                  />
                </motion.div>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          {/* Country */}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-foreground">
                  Country
                </FormLabel>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    {...field}
                    placeholder="Country"
                    className="border-muted/50 focus:ring-2 focus:ring-primary/50"
                  />
                </motion.div>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <motion.div
            className="sm:col-span-2 mt-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transition-all duration-300 animate-pulse-subtle"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  {form.watch("payment") === "CASH_ON_DELIVERY"
                    ? "Submitting..."
                    : "Redirecting..."}
                </>
              ) : form.watch("payment") === "CASH_ON_DELIVERY" ? (
                "Submit Order"
              ) : (
                "Proceed to Visa Payment"
              )}
            </Button>
          </motion.div>
        </form>
      </Form>
    </Card>
  );
}
