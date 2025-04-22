"use client";

import { categoryZod } from "@/validations/category.zod";
import { category } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import ImageUpload from "../shared/ImageUpload";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { createCategory, updateCategory } from "@/actions/category.action";

interface IProps {
  category?: category;
}

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

function CategoryForm({ category }: IProps) {
  const form = useForm<categoryZod>({
    defaultValues: category
      ? {
          image: category.image,
          name: category.name,
        }
      : {
          image: "",
          name: "",
        },
    resolver: zodResolver(categoryZod),
  });

  const onSubmit = async (data: categoryZod) => {
    try {
      if (category) {
        const updatePromise = updateCategory({ data, id: category.id });
        toast.promise(updatePromise, {
          loading: "Updating category...",
          success: "Category updated successfully!",
          error: "Error while updating category!",
        });
      } else {
        const createPromise = createCategory(data);
        toast.promise(createPromise, {
          loading: "Creating category...",
          success: "Category created successfully!",
          error: "Error while creating category!",
        });
        await createPromise;
        form.reset({ image: "", name: "" });
      }
    } catch (error) {
      console.error("Error while processing category:", error);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-b from-background to-primary/5 py-16"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-extrabold text-foreground mb-10 text-center tracking-tight">
            {category ? "Edit Category" : "Create New Category"}
          </h1>
        </motion.div>

        {/* Form Container */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-background/60 backdrop-blur-xl border border-primary/20 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-8 space-y-8 max-w-lg mx-auto"
          >
            {/* Section: Category Details */}
            <section>
              <h2 className="font-semibold text-2xl text-foreground mb-6">
                Category Details
              </h2>
              <div className="space-y-6">
                {/* Name Field */}
                <motion.div variants={fieldVariants}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">
                          Category Name
                        </FormLabel>
                        <Input
                          placeholder="Enter category name"
                          className="bg-background/80 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 rounded-lg"
                          {...field}
                        />
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Image Field */}
                <motion.div variants={fieldVariants}>
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">
                          Category Image
                        </FormLabel>
                        <div className="bg-background/80 border border-primary/20 rounded-lg p-4">
                          <ImageUpload
                            endpoint="singleImageUploader"
                            value={field.value ? [field.value] : []}
                            onChange={(urls) => field.onChange(urls[0] || "")}
                          />
                        </div>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </div>
            </section>

            {/* Submit Button */}
            <motion.div
              variants={fieldVariants}
              className="  bg-background/60 backdrop-blur-xl border-t border-primary/20 py-4 -mx-8 px-8 z-10"
            >
              <motion.div variants={buttonVariants} whileHover="hover">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
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
                  ) : category ? (
                    "Update Category"
                  ) : (
                    "Create Category"
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

export default CategoryForm;
