/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { PostType } from "@/lib/types/post.types";
import Image from "next/image";
import { format } from "date-fns";
import { Heart, MessageCircle } from "lucide-react";
import PostDropdownMenu from "./PostDropdownMenu";
import CommentForm from "./forms/CommentForm";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUpvote } from "@/actions/upvote.action";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import toast from "react-hot-toast";
import CommentList from "./CommentList";
import { motion } from "framer-motion";

function PostCard({ post }: { post: PostType }) {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  const [isUpvoted, setIsUpvoted] = useState(post.isUpvoted);

  const { mutate: upvote } = useMutation({
    mutationFn: () => createUpvote(post.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = queryClient.getQueryData(["posts"]);
      setIsUpvoted((prev) => !prev);
      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((p: PostType) =>
              p.id === post.id
                ? {
                    ...p,
                    isUpvoted: !isUpvoted,
                    _count: {
                      ...p._count,
                      upvotes: isUpvoted
                        ? p._count.upvotes - 1
                        : p._count.upvotes + 1,
                    },
                  }
                : p
            ),
          })),
        };
      });
      return { previousPosts };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["posts"], context?.previousPosts);
      setIsUpvoted((prev) => !prev);
      toast.error("Failed to update like");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  if (!post) return null;

  const dateToShow = post.updatedAt ?? post.createdAt;
  const UpdatedAtOrCreatedAt = post.updatedAt ? "Updated At " : "Created At";

  return (
    <motion.div
      className="rounded-xl border shadow-lg p-4 space-y-4 "
      whileHover={{ scale: 1.01, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={post.User.image || "/default-avatar.png"}
            alt={post.User?.name || "User"}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium">{post.User?.name}</p>
            <p className="text-xs text-muted-foreground">
              {UpdatedAtOrCreatedAt}:{" "}
              {format(new Date(dateToShow), "MMM d, yyyy h:mm a")}
            </p>
          </div>
        </div>
        {user?.id === post.userId && (
          <PostDropdownMenu postId={post.id} post={post} />
        )}
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold ">{post.title}</h2>
        {post.description && (
          <p className="text-sm text-gray-600">{post.description}</p>
        )}
        {post.image && (
          <div className="overflow-hidden rounded-lg">
            <Image
              src={post.image}
              alt={post.title}
              width={800}
              height={400}
              className="w-full max-h-[400px] object-cover rounded-md"
            />
          </div>
        )}
      </div>

      <div className="flex gap-4 text-sm">
        <motion.button
          onClick={() => upvote()}
          className="flex items-center gap-1 text-gray-500"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart
            className={`w-4 h-4 ${
              isUpvoted ? "fill-red-500 text-red-500" : "text-gray-500"
            }`}
          />
          {post._count.upvotes || 0}{" "}
          {post._count.upvotes === 1 ? "Like" : "Likes"}
        </motion.button>
        <motion.div
          className="flex items-center gap-1 "
          whileHover={{ scale: 1.1 }}
        >
          <MessageCircle className="w-4 h-4" />
          {post.comments?.length || 0} Comments
        </motion.div>
      </div>

      <div className="space-y-2">
        <CommentForm postId={post.id} />
        <CommentList postId={post.id} />
      </div>
    </motion.div>
  );
}

export default PostCard;
