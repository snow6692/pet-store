export const dynamic = "force-dynamic";

import { getPaginatedPosts } from "@/actions/post.action";
import PostForm from "@/components/forms/PostForm";
import Notifications from "@/components/Notifications";
import PostList from "@/components/PostList";
import SearchBar from "@/components/SearchBar";
import { Suspense } from "react";

interface IProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

async function CommunityPage({ searchParams }: IProps) {
  const { q = "" } = await searchParams;
  const { posts } = await getPaginatedPosts({ page: 1, search: q });

  return (
    <div className="space-y-6 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold  drop-shadow-sm font-['Inter']">
          Community
        </h1>
        <Notifications />
      </div>
      <div className=" backdrop-blur-md rounded-2xl p-6 shadow-lg">
        <PostForm />
      </div>
      <Suspense
        fallback={
          <div className="w-full h-10 bg-gray-600/20 rounded-lg animate-pulse" />
        }
      >
        <SearchBar />
      </Suspense>

      <PostList initialPosts={posts} search={q} />
    </div>
  );
}

export default CommunityPage;
