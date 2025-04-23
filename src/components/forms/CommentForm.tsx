/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentZod } from "@/validations/comment.zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createComment } from "@/actions/comment.action";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { motion } from "framer-motion";


const CommentForm = ({
  postId,
  parentId,
  onSuccess,
  defaultContent,
  onSubmit: customOnSubmit,
}: {
  postId: string;
  parentId?: string;
  onSuccess?: () => void;
  defaultContent?: string;
  onSubmit?: (data: commentZod) => void;
}) => {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();

  const form = useForm<commentZod>({
    resolver: zodResolver(commentZod),
    defaultValues: { content: defaultContent || "" },
  });

  const mutation = useMutation({
    mutationFn: (data: commentZod) => createComment({ data, postId, parentId }),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = queryClient.getQueryData(["posts"]);
      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old) return old;
        const newComment = {
          id: `temp-${Date.now()}`,
          content: data.content,
          userId: currentUser?.id || "",
          postId,
          parentId: parentId || null,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            id: currentUser?.id || "",
            name: currentUser?.name || "Unknown",
            image: currentUser?.image || null,
          },
        };
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: any) =>
              post.id === postId
                ? {
                    ...post,
                    comments: parentId
                      ? post.comments.map((comment: any) =>
                          comment.id === parentId
                            ? {
                                ...comment,
                                replies: [
                                  ...(comment.replies || []),
                                  newComment,
                                ],
                              }
                            : comment
                        )
                      : [...post.comments, newComment],
                  }
                : post
            ),
          })),
        };
      });
      return { previousPosts };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["posts"], context?.previousPosts);
      toast.error("Failed to post comment");
      console.error("Error posting comment:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Comment posted successfully");
      form.reset();
      onSuccess?.();
    },
  });

  const onSubmit = (data: commentZod) => {
    if (customOnSubmit) {
      customOnSubmit(data);
    } else {
      mutation.mutate(data);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder={
                      parentId ? "Write a reply..." : "Write a comment..."
                    }
                    rows={2}
                    className="
                        resize-none bg-gray-600/20 border-blue-400/20 text-gray-100
                        placeholder-gray-400 focus:ring-blue-400/50 rounded-md
                      "
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-rose-400" />
              </FormItem>
            )}
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting || mutation.isPending}
              className="
                  bg-gradient-to-r from-blue-400 to-purple-400 text-white
                  hover:from-blue-500 hover:to-purple-500 rounded-md
                "
            >
              {mutation.isPending || form.formState.isSubmitting
                ? "Posting..."
                : customOnSubmit
                ? "Update"
                : parentId
                ? "Reply"
                : "Comment"}
            </Button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
};
export default CommentForm;
