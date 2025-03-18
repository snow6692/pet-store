"use client";
import { userZod } from "@/validations/user.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import React from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import ImageUpload from "../shared/ImageUpload";
import { updateUser } from "@/actions/user.action";
import toast from "react-hot-toast";

function UpdateUserForm({ user }: { user: User }) {
  const form = useForm<userZod>({
    resolver: zodResolver(userZod),
    defaultValues: {
      name: user.name || "",
      image: user.image || "",
      phone: user.phone || "",
      address: user.address || "",
      city: user.city || "",
      state: user.state || "",
      postalCode: user.postalCode || "",
      country: user.country || "",
    },
  });

  const onSubmit = (values: userZod) => {
    console.log("Updated User Data:", values);
    const promise = updateUser(values);
    toast.promise(promise, {
      loading: "User updating...",
      success: "User updated!",
      error: "Something went wrong try again later",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <Input {...field} placeholder="Name" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload An Image</FormLabel>
              <ImageUpload
                endpoint="singleImageUploader"
                value={field.value ? [field.value] : []}
                onChange={(urls) => field.onChange(urls[0] || "")}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <Input {...field} placeholder="Phone Number" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <Input {...field} placeholder="Address" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <Input {...field} placeholder="City" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <Input {...field} placeholder="State" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <Input {...field} placeholder="Postal Code" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Input {...field} placeholder="Country" />
            </FormItem>
          )}
        />
        <Button type="submit">Update</Button>
      </form>
    </Form>
  );
}

export default UpdateUserForm;
