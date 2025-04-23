"use client";

import { userZod } from "@/validations/user.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import React from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import ImageUpload from "../shared/ImageUpload";
import { updateUser } from "@/actions/user.action";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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

  const onSubmit = async (values: userZod) => {
    const promise = updateUser(values);
    toast.promise(promise, {
      loading: "User updating...",
      success: "User updated!",
      error: "Something went wrong try again later",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    idle: { scale: 1 },
    pulse: {
      scale: [1, 1.03, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-background flex items-start justify-center pt-8">
      <motion.div
        className="w-full max-w-md p-6 bg-card rounded-xl shadow-md border border-border bg-gradient-to-b from-card to-muted/20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -2, boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)" }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
          Update Your Profile
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      Name
                    </FormLabel>
                    <motion.div
                      whileFocus={{
                        scale: 1.01,
                        borderColor: "hsl(var(--accent))",
                      }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Input
                        {...field}
                        placeholder="Enter your name"
                        className="border-border bg-background focus:border-accent focus:ring-2 focus:ring-accent/20 rounded-lg transition-all duration-300"
                        aria-label="Name"
                        aria-describedby={
                          fieldState.error ? "name-error" : undefined
                        }
                      />
                    </motion.div>
                    <FormMessage
                      id="name-error"
                      className="text-destructive text-sm mt-1"
                    />
                  </FormItem>
                )}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      Profile Image
                    </FormLabel>
                    <motion.div
                      className="p-3 bg-muted/50 rounded-lg border border-border"
                      whileHover={{ borderColor: "hsl(var(--accent))" }}
                      transition={{ duration: 0.2 }}
                    >
                      <ImageUpload
                        endpoint="singleImageUploader"
                        value={field.value ? [field.value] : []}
                        onChange={(urls) => field.onChange(urls[0] || "")}
                      />
                    </motion.div>
                    <FormMessage
                      id="image-error"
                      className="text-destructive text-sm mt-1"
                    />
                  </FormItem>
                )}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="phone"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      Phone
                    </FormLabel>
                    <motion.div
                      whileFocus={{
                        scale: 1.01,
                        borderColor: "hsl(var(--accent))",
                      }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Input
                        {...field}
                        placeholder="Enter your phone number"
                        className="border-border bg-background focus:border-accent focus:ring-2 focus:ring-accent/20 rounded-lg transition-all duration-300"
                        aria-label="Phone number"
                        aria-describedby={
                          fieldState.error ? "phone-error" : undefined
                        }
                      />
                    </motion.div>
                    <FormMessage
                      id="phone-error"
                      className="text-destructive text-sm mt-1"
                    />
                  </FormItem>
                )}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="address"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      Address
                    </FormLabel>
                    <motion.div
                      whileFocus={{
                        scale: 1.01,
                        borderColor: "hsl(var(--accent))",
                      }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Input
                        {...field}
                        placeholder="Enter your address"
                        className="border-border bg-background focus:border-accent focus:ring-2 focus:ring-accent/20 rounded-lg transition-all duration-300"
                        aria-label="Address"
                        aria-describedby={
                          fieldState.error ? "address-error" : undefined
                        }
                      />
                    </motion.div>
                    <FormMessage
                      id="address-error"
                      className="text-destructive text-sm mt-1"
                    />
                  </FormItem>
                )}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="city"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      City
                    </FormLabel>
                    <motion.div
                      whileFocus={{
                        scale: 1.01,
                        borderColor: "hsl(var(--accent))",
                      }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Input
                        {...field}
                        placeholder="Enter your city"
                        className="border-border bg-background focus:border-accent focus:ring-2 focus:ring-accent/20 rounded-lg transition-all duration-300"
                        aria-label="City"
                        aria-describedby={
                          fieldState.error ? "city-error" : undefined
                        }
                      />
                    </motion.div>
                    <FormMessage
                      id="city-error"
                      className="text-destructive text-sm mt-1"
                    />
                  </FormItem>
                )}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="state"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      State
                    </FormLabel>
                    <motion.div
                      whileFocus={{
                        scale: 1.01,
                        borderColor: "hsl(var(--accent))",
                      }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Input
                        {...field}
                        placeholder="Enter your state"
                        className="border-border bg-background focus:border-accent focus:ring-2 focus:ring-accent/20 rounded-lg transition-all duration-300"
                        aria-label="State"
                        aria-describedby={
                          fieldState.error ? "state-error" : undefined
                        }
                      />
                    </motion.div>
                    <FormMessage
                      id="state-error"
                      className="text-destructive text-sm mt-1"
                    />
                  </FormItem>
                )}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      Postal Code
                    </FormLabel>
                    <motion.div
                      whileFocus={{
                        scale: 1.01,
                        borderColor: "hsl(var(--accent))",
                      }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Input
                        {...field}
                        placeholder="Enter your postal code"
                        className="border-border bg-background focus:border-accent focus:ring-2 focus:ring-accent/20 rounded-lg transition-all duration-300"
                        aria-label="Postal code"
                        aria-describedby={
                          fieldState.error ? "postalCode-error" : undefined
                        }
                      />
                    </motion.div>
                    <FormMessage
                      id="postalCode-error"
                      className="text-destructive text-sm mt-1"
                    />
                  </FormItem>
                )}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="country"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      Country
                    </FormLabel>
                    <motion.div
                      whileFocus={{
                        scale: 1.01,
                        borderColor: "hsl(var(--accent))",
                      }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Input
                        {...field}
                        placeholder="Enter your country"
                        className="border-border bg-background focus:border-accent focus:ring-2 focus:ring-accent/20 rounded-lg transition-all duration-300"
                        aria-label="Country"
                        aria-describedby={
                          fieldState.error ? "country-error" : undefined
                        }
                      />
                    </motion.div>
                    <FormMessage
                      id="country-error"
                      className="text-destructive text-sm mt-1"
                    />
                  </FormItem>
                )}
              />
            </motion.div>
            <motion.div
              className="flex justify-between gap-4 pt-4"
              variants={itemVariants}
            >
              <Link href={`/profile/${user.id}`}>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto px-6 py-2 border-border text-foreground rounded-full hover:bg-muted/50 transition"
                >
                  Cancel
                </Button>
              </Link>
              <motion.div
                variants={buttonVariants}
                animate={form.formState.isValid ? "pulse" : "idle"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all disabled:opacity-50 shadow-sm"
                  disabled={form.formState.isSubmitting}
                >
                  <AnimatePresence mode="wait">
                    {form.formState.isSubmitting ? (
                      <motion.span
                        key="updating"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Updating...
                      </motion.span>
                    ) : (
                      <motion.span
                        key="update"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Update
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </motion.div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}

export default UpdateUserForm;
