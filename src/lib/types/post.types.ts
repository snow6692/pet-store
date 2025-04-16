// import { getPaginatedPosts } from "@/actions/post.action";

// export type getPostsReturnType = Awaited<ReturnType<typeof getPaginatedPosts>>;
// export type PostsType = getPostsReturnType["posts"];
// export type PostType = PostsType[number];

import { Post, User, Comment } from "@prisma/client";

export type PostType = Post & {
  User: User;
  comments: Comment[];
  _count: { upvotes: number };
};

export type PostsType = PostType[];
