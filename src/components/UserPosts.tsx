// components/UserPosts.tsx
"use client";

import { PostsType } from "@/lib/types/post.types";
import PostCard from "./PostCard";

function UserPosts({ posts }: { posts: PostsType }) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {posts.length === 0 && <p className="text-gray-500">No posts found.</p>}
    </div>
  );
}

export default UserPosts;
