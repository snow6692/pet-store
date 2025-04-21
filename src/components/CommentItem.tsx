/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import CommentForm from "./forms/CommentForm";
import Image from "next/image";
import { commentType } from "@/lib/types/comment.types";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { updateComment, deleteComment } from "@/actions/comment.action";
import toast from "react-hot-toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Edit, Trash2 } from "lucide-react";
import ConfirmDeleteDialog from "./dialogs/ConfirmDeleteDialog";

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
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: { content: string }) =>
      updateComment({ id: comment.id, data }),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = queryClient.getQueryData(["posts"]);
      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: any) =>
              post.id === postId
                ? {
                    ...post,
                    comments: updateCommentInTree(post.comments, comment.id, {
                      ...comment,
                      content: data.content,
                      updatedAt: new Date(),
                    }),
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
      toast.error("Failed to update comment");
      console.error("Error updating comment:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast.success("Comment updated successfully");
      setIsEditing(false);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteComment(comment.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = queryClient.getQueryData(["posts"]);
      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: any) =>
              post.id === postId
                ? {
                    ...post,
                    comments: removeCommentFromTree(post.comments, comment.id),
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
      toast.error("Failed to delete comment");
      console.error("Error deleting comment:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["comments"] });

      toast.success("Comment deleted successfully");
    },
  });

  // Helper function to update a comment in the tree
  const updateCommentInTree = (
    comments: commentType[],
    commentId: string,
    updatedComment: commentType
  ): commentType[] => {
    return comments.map((c) =>
      c.id === commentId
        ? { ...c, ...updatedComment }
        : {
            ...c,
            replies: c.replies
              ? updateCommentInTree(c.replies, commentId, updatedComment)
              : c.replies,
          }
    );
  };

  // Helper function to remove a comment from the tree
  const removeCommentFromTree = (
    comments: commentType[],
    commentId: string
  ): commentType[] => {
    return comments
      .filter((c) => c.id !== commentId)
      .map((c) => ({
        ...c,
        replies: c.replies
          ? removeCommentFromTree(c.replies, commentId)
          : c.replies,
      }));
  };

  // Check if the current user is the comment owner
  const isOwner = currentUser?.id === comment.userId;

  return (
    <div className={`ml-${level * 4} border-l-2 pl-4`}>
      <div className="flex items-center gap-2">
        <Image
          src={comment.user.image || "/default-avatar.png"}
          alt={comment.user.name || "User"}
          width={24}
          height={24}
          className="rounded-full"
        />
        <p className="text-sm font-medium">
          {comment.user.name || "Anonymous"}
        </p>
        <p className="text-xs text-gray-500">
          {format(new Date(comment.createdAt), "MMM d, yyyy h:mm a")}
        </p>
        {isOwner && (
          <div className="ml-auto flex gap-2 items-center">
            <Edit
              className="w-4 h-4 text-green-500 cursor-pointer"
              onClick={() => setIsEditing(!isEditing)}
            />

            <ConfirmDeleteDialog
              onDelete={() => deleteMutation.mutate()}
              name=""
              id={comment.id}
            >
              <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" />
            </ConfirmDeleteDialog>
          </div>
        )}
      </div>
      {isEditing ? (
        <div className="mt-2">
          <CommentForm
            postId={postId}
            defaultContent={comment.content}
            onSuccess={() => {
              setIsEditing(false);
              queryClient.invalidateQueries({ queryKey: ["posts"] });
              queryClient.invalidateQueries({ queryKey: ["comments"] });
            }}
            onSubmit={(data) => updateMutation.mutate(data)}
          />
        </div>
      ) : (
        <p className="text-sm">{comment.content}</p>
      )}
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
              queryClient.invalidateQueries({ queryKey: ["posts"] });
              queryClient.invalidateQueries({ queryKey: ["comments"] });
            }}
          />
        </div>
      )}
      {comment.replies?.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply: commentType) => (
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

export default CommentItem;
