"use client";

import { cachedUser } from "@/lib/cache/user.cache";
import { useQuery } from "@tanstack/react-query";
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
import PaymentDialog from "../dialogs/PaymentDialog";

export default function CheckoutForm({
  onSubmit,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void;
}) {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: cachedUser,
  });

  const form = useForm<orderZod>({
    resolver: zodResolver(orderZod),
    defaultValues: {
      email: "",
      address: "",
      name: "",
      phone: "",
      postalCode: "",
      city: "",
      state: "",
      country: "",
      payment: "CASH_ON_DELIVERY",
    },
  });

  const paymentMethod = form.watch("payment");
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

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Name */}
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

        {paymentMethod === "CASH_ON_DELIVERY" ? (
          <Button type="submit">Cash On Delivery</Button>
        ) : (
          <PaymentDialog>
            <Button asChild className=" bg-green-500 hover:bg-green-600">
              <span> Visa </span>
            </Button>
          </PaymentDialog>
        )}
      </form>
    </Form>
  );
}
