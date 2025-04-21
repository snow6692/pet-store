/* eslint-disable @typescript-eslint/no-explicit-any */
// components/PostDropdownMenu.tsx
"use client";

import toast from "react-hot-toast";
import { deletePost } from "@/actions/post.action";
import UpdatePostDialog from "./dialogs/UpdatePostDialog";
import { PenBox, Trash2 } from "lucide-react";
import { Post } from "@prisma/client";
import ConfirmDeleteDialog from "./dialogs/ConfirmDeleteDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  postId: string;
  post: Post;
};

export default function PostDropdownMenu({ postId, post }: Props) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deletePost(postId),
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot the previous posts
      const previousPosts = queryClient.getQueryData(["posts"]);

      // Optimistically remove the post from the cache
      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            posts: page.posts.filter((p: any) => p.id !== postId),
          })),
        };
      });

      // Return context for rollback
      return { previousPosts };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(["posts"], context?.previousPosts);
      toast.error("Failed to delete post");
      console.error("Error deleting post:", error);
    },
    onSuccess: () => {
      // Invalidate to refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully");
      // Optional: router.refresh() if you want to force a full reload
    },
  });

  const handleDelete = () => {
    mutation.mutate();
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <UpdatePostDialog post={post}>
        <PenBox className="cursor-pointer text-green-500" />
      </UpdatePostDialog>
      <ConfirmDeleteDialog onDelete={handleDelete} id={postId} name="Post">
        <Trash2 className="text-red-500 cursor-pointer" />
      </ConfirmDeleteDialog>
    </div>
  );
}
