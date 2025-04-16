// import { getPaginatedPosts } from "@/actions/post.action";
// import PostForm from "@/components/forms/PostForm";
// import PostList from "@/components/PostList";
// import React from "react";

// interface IProps {
//   searchParams: Promise<{ page?: string }>;
// }
// async function CommunityPage({ searchParams }: IProps) {
//   const page = (await searchParams).page || 1;
//   const { posts, hasMore } = await getPaginatedPosts(Number(page));
//   console.log(posts);
//   return (
//     <div className="space-y-6 max-w-2xl mx-auto">
//       <PostForm />
//       <PostList posts={posts} hasMore={hasMore} page={Number(page)} />
//     </div>
//   );
// }

// export default CommunityPage;

// app/community/page.tsx
import { getPaginatedPosts } from "@/actions/post.action";
import PostForm from "@/components/forms/PostForm";
import Notifications from "@/components/Notifications";
import PostList from "@/components/PostList";
import SearchBar from "@/components/SearchBar";

interface IProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

async function CommunityPage({ searchParams }: IProps) {
  const { q = "" } = await searchParams;
  const { posts } = await getPaginatedPosts({ page: 1, search: q });
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Notifications />
      <PostForm />
      <SearchBar />
      <PostList initialPosts={posts} search={q} />
    </div>
  );
}

export default CommunityPage;
