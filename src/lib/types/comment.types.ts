
import { Comment, User } from "@prisma/client";

export type commentType = Comment & {
  user: User;
  replies: commentType[];
};
