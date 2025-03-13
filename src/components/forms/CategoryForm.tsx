"use client";

import { categoryZod } from "@/validations/category.zod";
import { category } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import ImageUpload from "../shared/ImageUpload";
import { Button } from "../ui/button";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { createCategory } from "@/actions/category.action";
interface IProps {
  category?: category;
}
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

  useEffect(() => {
    if (category) {
      form.reset({
        image: category.image || "",
        name: category.name || "",
      });
    }
  }, [category, form]);

  const onSubmit = async (data: categoryZod) => {
    // Update
    if (category) {
      console.log("Updating category:", data);
    }
    // Create
    else {
      const createPromise = createCategory(data);

      toast.promise(createPromise, {
        loading: "Creating...",
        success: "Category Created Successfully!",
        error: "Error While Creating!",
      });

      try {
        await createPromise; 
        form.reset({ image: "", name: "" });     
      } catch (error) {
        console.error("Error while creating category:", error);
      }
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        action=""
        className="space-y-8"
      >
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter category name</FormLabel>
              <Input placeholder="Category name" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Image */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add an image</FormLabel>

              <ImageUpload
                endpoint="singleImageUploader"
                value={field.value ? [field.value] : []}
                onChange={(urls) =>
                  field.onChange(urls.length > 0 ? urls[0] : "")
                }
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={form.formState.isSubmitting}>
          {category ? "Update the Category " : "Create a new category"}
        </Button>
      </form>
    </Form>
  );
}

export default CategoryForm;
