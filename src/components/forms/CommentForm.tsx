// components/forms/CommentForm.tsx
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

export default function CommentForm({
  postId,
  parentId,
  onSuccess,
}: {
  postId: string;
  parentId?: string;
  onSuccess?: () => void;
}) {
  const form = useForm<commentZod>({
    resolver: zodResolver(commentZod),
    defaultValues: { content: "" },
  });

  const onSubmit = async (data: commentZod) => {
    try {
      await toast.promise(createComment({ data, postId, parentId }), {
        loading: "Posting comment...",
        success: "Comment posted successfully",
        error: "Failed to post comment",
      });
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
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
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? "Posting..."
            : parentId
            ? "Reply"
            : "Comment"}
        </Button>
      </form>
    </Form>
  );
}
