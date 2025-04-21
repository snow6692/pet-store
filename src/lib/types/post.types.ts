import { Post, User, Comment } from "@prisma/client";

export type PostType = Post & {
  User: Pick<User, "id" | "name" | "image">;
  comments: Comment[];
  _count: { upvotes: number };
  isUpvoted: boolean;
  upvotes: { id: string }[] | false;
};

export type PostsType = PostType[];
