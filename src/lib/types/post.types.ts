

import { Post, User, Comment, Upvote } from "@prisma/client";

export type PostType = Post & {
  User: Pick<User, "id" | "name" | "image">;
  comments: Comment[];
  upvotes: Upvote[];
  _count: { upvotes: number };
  isUpvoted: boolean;
};

export type PostsType = PostType[];
