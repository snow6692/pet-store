"use client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postZod } from "@/validations/post.zod";
import { z } from "zod";
import ImageUpload from "../shared/ImageUpload";
import { ImageIcon, UserIcon } from "lucide-react";
import { Post } from "@prisma/client";
import toast from "react-hot-toast";
import { upsertPost } from "@/actions/post.action";

type PostFormValues = z.infer<typeof postZod>;

export default function PostForm({ post }: { post?: Post }) {
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postZod),
    defaultValues: post
      ? {
          title: post.title || "",
          description: post.description || "",
          image: post.image || "",
        }
      : {
          title: "",
          description: "",
          image: "",
        },
  });

  const onSubmit = async (data: PostFormValues) => {
    try {
      if (post) {
        await toast.promise(upsertPost({ data, id: post.id }), {
          loading: "Updating post...",
          success: "Post updated successfully",
          error: "Failed to update post",
        });
      } else {
        await toast.promise(upsertPost({ data, id: "" }), {
          loading: "Creating post...",
          success: "Post created successfully",
          error: "Failed to create post",
        });

        form.reset(); // reset after successful creation
      }
    } catch (error) {
      console.error("Error during post creation or update:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-2xl w-full mx-auto rounded-2xl shadow-md p-6 space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="bg-gray-200 p-2 rounded-full">
            <UserIcon className="w-6 h-6 " />
          </div>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="What's on your mind?"
                    className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-lg font-medium"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Add more details..."
                  rows={3}
                  className="resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-gray-700 text-sm">
                <ImageIcon className="w-4 h-4" />
                Add an image
              </FormLabel>
              <FormControl>
                <ImageUpload
                  endpoint="singleImageUploader"
                  value={field.value ? [field.value] : []}
                  onChange={(urls) => field.onChange(urls[0] || "")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="px-6"
          >
            {form.formState.isSubmitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
