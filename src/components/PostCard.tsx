/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { PostType } from "@/lib/types/post.types";
import Image from "next/image";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Heart, MessageCircle } from "lucide-react";
import PostDropdownMenu from "./PostDropdownMenu";
import CommentForm from "./forms/CommentForm";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUpvote } from "@/actions/upvote.action";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import toast from "react-hot-toast";
import CommentList from "./CommentList";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

const buttonVariants = {
  hover: { scale: 1.1, transition: { type: "spring", stiffness: 300 } },
  tap: { scale: 0.9 },
};
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const collapseVariants = {
  open: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};
const PostCard = ({ post }: { post: PostType }) => {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  const [isUpvoted, setIsUpvoted] = useState(post.isUpvoted);
  const [showComments, setShowComments] = useState(false);

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
      className="
        rounded-xl border border-blue-400/20  backdrop-blur-md
        shadow-lg p-6 space-y-4 hover:shadow-[0_10px_20px_rgba(0,0,0,0.15)]
      "
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex justify-between items-center">
        <Link
          href={`/profile/${post.User.id}`}
          className="flex items-center gap-3"
        >
          <Image
            src={post.User.image || "/default-avatar.png"}
            alt={post.User?.name || "User"}
            width={40}
            height={40}
            className="rounded-full object-cover border border-blue-400/30"
          />
          <div>
            <p className="text-sm font-medium  font-['Inter']">
              {post.User?.name}
            </p>
            <p className="text-xs">
              {UpdatedAtOrCreatedAt}:{" "}
              {format(new Date(dateToShow), "MMM d, yyyy h:mm a")}
            </p>
          </div>
        </Link>
        {user?.id === post.userId && (
          <PostDropdownMenu postId={post.id} post={post} />
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold  font-['Inter']">{post.title}</h2>
        {post.description && <p className="text-sm ">{post.description}</p>}
        {post.image && (
          <div className="overflow-hidden rounded-lg">
            <Image
              src={post.image}
              alt={post.title}
              width={800}
              height={400}
              className="w-full max-h-[400px] object-cover rounded-md transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}
      </div>

      <div className="flex gap-4 text-sm">
        <motion.button
          onClick={() => upvote()}
          className="flex items-center gap-1 "
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          aria-label={isUpvoted ? "Unlike post" : "Like post"}
        >
          <Heart
            className={`w-4 h-4 ${
              isUpvoted ? "fill-rose-400 text-rose-400" : "text-gray-400"
            }`}
          />
          {post._count.upvotes || 0}{" "}
          {post._count.upvotes === 1 ? "Like" : "Likes"}
        </motion.button>
        <motion.div
          className="flex items-center gap-1 "
          variants={buttonVariants}
          whileHover="hover"
        >
          <MessageCircle className="w-4 h-4" />
          {post.comments?.length || 0} Comments
        </motion.div>
      </div>

      <motion.button
        className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-['Inter']"
        onClick={() => setShowComments(!showComments)}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        aria-label={showComments ? "Hide comments" : "Show comments"}
      >
        {showComments ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
        {showComments ? "Hide Comments" : "Show Comments"}
      </motion.button>

      <AnimatePresence>
        {showComments && (
          <motion.div
            variants={collapseVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="space-y-2"
          >
            <CommentForm postId={post.id} />
            <CommentList postId={post.id} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PostCard;
