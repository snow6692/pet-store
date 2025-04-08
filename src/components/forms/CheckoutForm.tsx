/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cachedUser } from "@/lib/cache/user.cache";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { orderZod } from "@/validations/order.zod";
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

const stripePromise = loadStripe(config.stripe.public);

export default function CheckoutForm() {
  const { data: user } = useQuery({ queryKey: ["user"], queryFn: cachedUser });
  const queryClient = useQueryClient();

  const form = useForm({
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
  const handleSubmit = async (data: orderZod) => {
    if (data.payment === "CASH_ON_DELIVERY") {
      const promise = placeOrder(data);
      toast.promise(promise, {
        loading: "Creating order...",
        error: "Failed to make an order",
        success: "Order Created Successfully!",
      });
      if ((await promise).success) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        queryClient.invalidateQueries({ queryKey: ["cartCount"] });
      }
    } else {
      try {
        const orderResponse = await placeOrder(data);
        if (orderResponse.sessionId) {
          const stripe = await stripePromise;
          const { error } = await stripe.redirectToCheckout({
            sessionId: orderResponse.sessionId,
          });

          if (error) {
            toast.error(error.message!);
          }
        }
      } catch (error: any) {
        toast.error("Payment failed. Try again.");
      }
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <Input {...field} placeholder="Name" />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Input type="email" {...field} placeholder="Email" />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <Input type="tel" {...field} placeholder="Phone Number" />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Payment Method */}
        <FormField
          control={form.control}
          name="payment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH_ON_DELIVERY">
                    Cash on Delivery
                  </SelectItem>
                  <SelectItem value="VISA">Visa</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <Input {...field} placeholder="Address" />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Postal Code */}
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <Input {...field} placeholder="Postal Code" />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* City */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <Input {...field} placeholder="City" />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* State */}
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <Input {...field} placeholder="State" />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Country */}
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Input {...field} placeholder="Country" />
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("payment") === "CASH_ON_DELIVERY" ? (
          <Button type="submit">Submit Order</Button>
        ) : (
          <Button type="submit">Proceed to Visa Payment</Button>
        )}
      </form>
    </Form>
  );
}
