/* eslint-disable @typescript-eslint/no-explicit-any */
// components/PostCard.tsx
"use client";

import { PostType } from "@/lib/types/post.types";
import { commentType } from "@/lib/types/comment.types";
import Image from "next/image";
import { format } from "date-fns";
import { Heart, MessageCircle } from "lucide-react";
import PostDropdownMenu from "./PostDropdownMenu";
import CommentForm from "./forms/CommentForm";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUpvote } from "@/actions/upvote.action";
import { getComments } from "@/actions/comment.action";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import toast from "react-hot-toast";

function CommentList({ postId }: { postId: string }) {
  const { data: comments } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getComments(postId),
  });

  if (!comments || comments.length === 0) return null;

  return (
    <div className="space-y-2 mt-4">
      {comments.map((comment: commentType) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          level={0}
        />
      ))}
    </div>
  );
}

function CommentItem({
  comment,
  postId,
  level,
}: {
  comment: commentType;
  postId: string;
  level: number;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const queryClient = useQueryClient();

  return (
    <div className={`ml-${level * 4} border-l-2 pl-4`}>
      <div className="flex items-center gap-2">
        <Image
          src={comment.user.image || ""}
          alt={comment.user.name || "User"}
          width={24}
          height={24}
          className="rounded-full"
        />
        <p className="text-sm font-medium">{comment.user.name}</p>
        <p className="text-xs text-gray-500">
          {format(new Date(comment.createdAt), "MMM d, yyyy h:mm a")}
        </p>
      </div>
      <p className="text-sm">{comment.content}</p>
      <button
        onClick={() => setShowReplyForm(!showReplyForm)}
        className="text-xs text-blue-500"
      >
        Reply
      </button>
      {showReplyForm && (
        <div className="mt-2">
          <CommentForm
            postId={postId}
            parentId={comment.id}
            onSuccess={() => {
              setShowReplyForm(false);
              queryClient.invalidateQueries({ queryKey: ["comments", postId] });
            }}
          />
        </div>
      )}
      {comment.replies?.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// function PostCard({ post }: { post: PostType }) {
//   const { data: user } = useCurrentUser();
//   const queryClient = useQueryClient();
//   const [isUpvoted, setIsUpvoted] = useState(post.isUpvoted); // Initialize with post.isUpvoted

//   const { mutate: upvote } = useMutation({
//     mutationFn: () => createUpvote(post.id),
//     onMutate: async () => {
//       // Cancel any outgoing refetches
//       await queryClient.cancelQueries({ queryKey: ["posts"] });

//       // Snapshot the previous value
//       const previousPosts = queryClient.getQueryData(["posts"]);

//       // Optimistically update the upvote count and state
//       setIsUpvoted((prev) => !prev);
//       queryClient.setQueryData(["posts"], (old: any) => {
//         if (!old) return old;
//         return {
//           ...old,
//           pages: old.pages.map((page: any) => ({
//             ...page,
//             posts: page.posts.map((p: PostType) =>
//               p.id === post.id
//                 ? {
//                     ...p,
//                     isUpvoted: !isUpvoted,
//                     _count: {
//                       ...p._count,
//                       upvotes: isUpvoted
//                         ? p._count.upvotes - 1
//                         : p._count.upvotes + 1,
//                     },
//                   }
//                 : p
//             ),
//           })),
//         };
//       });

//       // Return context for rollback
//       return { previousPosts };
//     },
//     onError: (err, variables, context) => {
//       // Rollback on error
//       queryClient.setQueryData(["posts"], context?.previousPosts);
//       setIsUpvoted((prev) => !prev);
//       toast.error("Failed to update like");
//     },
//     onSuccess: (data) => {
//       console.log("Upvote action result:", data); // Debug log
//       // Invalidate to refetch
//       queryClient.invalidateQueries({ queryKey: ["posts"] });
//     },
//   });

function PostCard({ post }: { post: PostType }) {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  const [isUpvoted, setIsUpvoted] = useState(post.isUpvoted); // Uses post.isUpvoted

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
    <div className="rounded-xl border shadow p-4 space-y-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={post.User.image || ""}
            alt={post.User?.name || "User"}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium">{post.User?.name}</p>
            <p className="text-xs">
              {UpdatedAtOrCreatedAt}:
              {format(new Date(dateToShow), "MMM d, yyyy h:mm a")}
            </p>
          </div>
        </div>
        {user?.id === post.userId && (
          <PostDropdownMenu postId={post.id} post={post} />
        )}
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">{post.title}</h2>
        {post.description && <p className="text-sm">{post.description}</p>}
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
        <button onClick={() => upvote()} className="flex items-center gap-1">
          <Heart
            className={`w-4 h-4 ${
              isUpvoted ? "fill-red-500 text-red-500" : "text-gray-500"
            }`}
          />
          {post._count.upvotes || 0}{" "}
          {post._count.upvotes === 1 ? "Like" : "Likes"}
        </button>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4" />
          {post.comments?.length || 0} Comments
        </div>
      </div>

      <CommentForm postId={post.id} />
      <CommentList postId={post.id} />
    </div>
  );
}

export default PostCard;
