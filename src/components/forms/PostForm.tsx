/* eslint-disable @typescript-eslint/no-explicit-any */
// components/forms/PostForm.tsx
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type PostFormValues = z.infer<typeof postZod>;

export default function PostForm({ post }: { post?: Post }) {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();

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

  const mutation = useMutation({
    mutationFn: (data: PostFormValues) => upsertPost({ data, id: post?.id }),
    onMutate: async (data) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot the previous posts
      const previousPosts = queryClient.getQueryData(["posts"]);

      // Optimistically update the cache
      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old) return old;

        //This will be shown automatically after clicking update or post
        const newPost = {
          id: post?.id || `temp-${Date.now()}`, // Temporary ID for new posts
          title: data.title,
          description: data.description,
          image: data.image,
          userId: currentUser?.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          User: {
            id: currentUser?.id,
            name: currentUser?.name,
            image: currentUser?.image,
          },
          comments: [],
          _count: { upvotes: 0 },
          isUpvoted: false,
          upvotes: false,
        };

        if (post) {
          // Update existing post
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((p: any) =>
                p.id === post.id ? { ...p, ...newPost } : p 
              ),
            })),
          };
        } else {
          // Add new post to the first page
          return {
            ...old,
            pages: [
              {
                ...old.pages[0],
                posts: [newPost, ...old.pages[0].posts],
              },
              ...old.pages.slice(1),
            ],
          };
        }
      });

      // Return context for rollback
      return { previousPosts };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(["posts"], context?.previousPosts);
      toast.error(post ? "Failed to update post" : "Failed to create post");
      console.error("Error during post creation or update:", error);
    },
    onSuccess: () => {
      // Invalidate to refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success(
        post ? "Post updated successfully" : "Post created successfully"
      );
      if (!post) {
        form.reset(); // Reset form after successful creation
      }
    },
  });

  const onSubmit = (data: PostFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-2xl w-full mx-auto rounded-2xl shadow-md p-6 space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="bg-gray-200 p-2 rounded-full">
            <UserIcon className="w-6 h-6" />
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
            disabled={form.formState.isSubmitting || mutation.isPending}
            className="px-6"
          >
            {post
              ? mutation.isPending
                ? "Updating..."
                : "Update"
              : mutation.isPending
              ? "Posting..."
              : "Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
