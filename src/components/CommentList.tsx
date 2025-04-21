import React from "react";
import CommentItem from "./CommentItem";
import { getComments } from "@/actions/comment.action";
import { useQuery } from "@tanstack/react-query";
import { commentType } from "@/lib/types/comment.types";

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

export default CommentList;
