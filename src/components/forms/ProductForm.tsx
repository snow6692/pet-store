

"use client";

import React from "react";
import { productZod } from "@/validations/product.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { ProductWithCategoriesTable } from "@/lib/types/product.types";
import { ProductStatus } from "@prisma/client";
import toast from "react-hot-toast";
import { createProduct, updateProduct } from "@/actions/product.action";
import { useGetAllCategories } from "@/hooks/useGetCategories";
import Loader from "../shared/Loader";
import ImageUpload from "../shared/ImageUpload";
import { motion } from "framer-motion";

interface IProps {
  product?: ProductWithCategoriesTable;
  isInDialog?: boolean; // Added prop
}

type Status = { value: string; name: string };
const status: Status[] = [
  { value: "ACTIVE", name: "Active" },
  { value: "INACTIVE", name: "Inactive" },
  { value: "OUT_OF_STOCK", name: "Out of Stock" },
];

// Animation variants (unchanged)
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const buttonVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

function ProductForm({ product, isInDialog = false }: IProps) {
  const form = useForm({
    resolver: zodResolver(productZod),
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          images: product.images,
          price: product.price,
          description: product.description ?? undefined,
          quantity: product.quantity,
          status: product.status as ProductStatus,
          discount: product.discount ?? undefined,
          brand: product.brand ?? undefined,
          isFeatured: product.isFeatured,
          categoryId: product.category.id,
        }
      : {
          name: "",
          slug: "",
          images: [],
          price: 1,
          description: "",
          quantity: 1,
          status: "ACTIVE",
          discount: 0,
          brand: "",
          isFeatured: false,
          categoryId: "",
        },
  });

  const { data: categories, isLoading, error } = useGetAllCategories();
  if (isLoading) return <Loader />;
  if (error || !categories) return <p>Error fetching categories</p>;

  const onSubmit = async (data: productZod) => {
    if (product) {
      const updatePromise = updateProduct({ data, id: product.id });
      toast.promise(updatePromise, {
        loading: "Updating...",
        success: "Product Updated Successfully!",
        error: "Error While Updating!",
      });
    } else {
      const createPromise = createProduct(data);
      toast.promise(createPromise, {
        loading: "Creating...",
        success: "Product Created Successfully!",
        error: "Error While Creating!",
      });

      try {
        await createPromise;
        form.reset();
      } catch (error) {
        console.error("Error while Product category:", error);
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`
        ${isInDialog ? "py-2" : "min-h-screen py-16"}
        bg-gradient-to-b from-background to-primary/5
      `}
    >
      <div
        className={`
          ${isInDialog ? "px-0" : "container mx-auto px-4 sm:px-6 lg:px-8"}
        `}
      >
        {/* Header (only shown outside dialog) */}
        {!isInDialog && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold text-foreground mb-10 text-center tracking-tight">
              {product ? "Edit Product" : "Create New Product"}
            </h1>
          </motion.div>
        )}

        {/* Form Container */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={`
              bg-background/60 backdrop-blur-xl
              border border-primary/20
              rounded-2xl
              shadow-[0_4px_12px_rgba(0,0,0,0.1)]
              ${isInDialog ? "p-4 space-y-4" : "p-8 space-y-8"}
            `}
          >
            {/* Section: Basic Information */}
            <section>
              <h2
                className={`font-semibold text-foreground ${
                  isInDialog ? "text-xl mb-4" : "text-2xl mb-6"
                }`}
              >
                Basic Information
              </h2>
              <div
                className={`grid grid-cols-1 md:grid-cols-2 ${
                  isInDialog ? "gap-4" : "gap-6"
                }`}
              >
                <motion.div variants={fieldVariants}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">
                          Product Name
                        </FormLabel>
                        <Input
                          {...field}
                          placeholder="Enter product name"
                          className="
                            bg-background/80 border-primary/20
                            focus:border-primary focus:ring-2 focus:ring-primary/20
                            transition-all duration-300 rounded-lg
                          "
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                <motion.div variants={fieldVariants}>
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">
                          Slug
                        </FormLabel>
                        <Input
                          {...field}
                          placeholder="Enter slug (e.g., product-name)"
                          className="
                            bg-background/80 border-primary/20
                            focus:border-primary focus:ring-2 focus:ring-primary/20
                            transition-all duration-300 rounded-lg
                          "
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </div>
            </section>

            {/* Section: Pricing & Inventory */}
            <section>
              <h2
                className={`font-semibold text-foreground ${
                  isInDialog ? "text-xl mb-4" : "text-2xl mb-6"
                }`}
              >
                Pricing & Inventory
              </h2>
              <div
                className={`grid grid-cols-1 md:grid-cols-2 ${
                  isInDialog ? "gap-4" : "gap-6"
                }`}
              >
                <motion.div variants={fieldVariants}>
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">
                          Price
                        </FormLabel>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Enter price"
                          className="
                            bg-background/80 border-primary/20
                            focus:border-primary focus:ring-2 focus:ring-primary/20
                            transition-all duration-300 rounded-lg
                          "
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                <motion.div variants={fieldVariants}>
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">
                          Quantity
                        </FormLabel>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Enter quantity"
                          className="
                            bg-background/80 border-primary/20
                            focus:border-primary focus:ring-2 focus:ring-primary/20
                            transition-all duration-300 rounded-lg
                          "
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                <motion.div variants={fieldVariants}>
                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">
                          Discount (%)
                        </FormLabel>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Enter discount percentage"
                          value={field.value ?? 0}
                          className="
                            bg-background/80 border-primary/20
                            focus:border-primary focus:ring-2 focus:ring-primary/20
                            transition-all duration-300 rounded-lg
                          "
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </div>
            </section>

            {/* Section: Category & Status */}
            <section>
              <h2
                className={`font-semibold text-foreground ${
                  isInDialog ? "text-xl mb-4" : "text-2xl mb-6"
                }`}
              >
                Category & Status
              </h2>
              <div
                className={`grid grid-cols-1 md:grid-cols-2 ${
                  isInDialog ? "gap-4" : "gap-6"
                }`}
              >
                <motion.div variants={fieldVariants}>
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">
                          Category
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger
                            className="
                              bg-background/80 border-primary/20
                              focus:border-primary focus:ring-2 focus:ring-primary/20
                              transition-all duration-300 rounded-lg
                            "
                          >
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                <motion.div variants={fieldVariants}>
                  <FormField
                    name="status"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">
                          Status
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={product ? product.status : field.value}
                        >
                          <SelectTrigger
                            className="
                              bg-background/80 border-primary/20
                              focus:border-primary focus:ring-2 focus:ring-primary/20
                              transition-all duration-300 rounded-lg
                            "
                          >
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {status.map((status) => (
                              <SelectItem
                                key={status.value}
                                value={status.value}
                              >
                                {status.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </div>
            </section>

            {/* Section: Images */}
            <section>
              <h2
                className={`font-semibold text-foreground ${
                  isInDialog ? "text-xl mb-4" : "text-2xl mb-6"
                }`}
              >
                Product Images
              </h2>
              <motion.div variants={fieldVariants}>
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">
                        Images
                      </FormLabel>
                      <div
                        className={`
                          bg-background/80 border border-primary/20
                          rounded-lg ${isInDialog ? "p-3" : "p-4"}
                        `}
                      >
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          endpoint="multiImageUploader"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            </section>

            {/* Section: Additional Details */}
            <section>
              <h2
                className={`font-semibold text-foreground ${
                  isInDialog ? "text-xl mb-4" : "text-2xl mb-6"
                }`}
              >
                Additional Details
              </h2>
              <div
                className={`grid grid-cols-1 ${isInDialog ? "gap-4" : "gap-6"}`}
              >
                <motion.div variants={fieldVariants}>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">
                          Description
                        </FormLabel>
                        <Textarea
                          {...field}
                          placeholder="Enter product description"
                          value={field.value ?? ""}
                          className={`
                            bg-background/80 border-primary/20
                            focus:border-primary focus:ring-2 focus:ring-primary/20
                            transition-all duration-300 rounded-lg
                            ${isInDialog ? "min-h-[100px]" : "min-h-[120px]"}
                          `}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                <motion.div variants={fieldVariants}>
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">
                          Brand
                        </FormLabel>
                        <Input
                          {...field}
                          placeholder="Enter brand name"
                          className="
                            bg-background/80 border-primary/20
                            focus:border-primary focus:ring-2 focus:ring-primary/20
                            transition-all duration-300 rounded-lg
                          "
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                <motion.div variants={fieldVariants}>
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <Checkbox
                          onCheckedChange={field.onChange}
                          checked={field.value}
                          className="
                            border-primary/20
                            data-[state=checked]:bg-primary
                            data-[state=checked]:border-primary
                          "
                        />
                        <FormLabel className="text-sm font-medium text-foreground">
                          Featured Product
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </div>
            </section>

            {/* Submit Button */}
            <motion.div
              variants={fieldVariants}
              className={`
                sticky bottom-0
                bg-background/60 backdrop-blur-xl
                border-t border-primary/20
                z-10
                ${isInDialog ? "py-3 -mx-4 px-4" : "py-4 -mx-8 px-8"}
              `}
            >
              <motion.div variants={buttonVariants} whileHover="hover">
                <Button
                  disabled={form.formState.isSubmitting}
                  className="
                    w-full bg-primary hover:bg-primary/90
                    text-primary-foreground font-semibold
                    rounded-lg
                    shadow-md hover:shadow-lg
                    transition-all duration-300
                  "
                >
                  {form.formState.isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : product ? (
                    "Update Product"
                  ) : (
                    "Create Product"
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </form>
        </Form>
      </div>
    </motion.div>
  );
}

export default ProductForm;
