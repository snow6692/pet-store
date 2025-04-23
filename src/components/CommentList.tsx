import React from "react";
import CommentItem from "./CommentItem";
import { getComments } from "@/actions/comment.action";
import { useQuery } from "@tanstack/react-query";
import { commentType } from "@/lib/types/comment.types";
import { motion } from "framer-motion";

const commentVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, type: "spring", stiffness: 100 },
  }),
};
const CommentList = ({ postId }: { postId: string }) => {
  const { data: comments } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getComments(postId),
  });

  if (!comments || comments.length === 0) return null;

  return (
    <motion.div className="space-y-2 mt-4">
      {comments.map((comment: commentType, index: number) => (
        <motion.div
          key={comment.id}
          variants={commentVariants}
          custom={index}
          initial="hidden"
          animate="visible"
        >
          <CommentItem comment={comment} postId={postId} level={0} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CommentList;
