

"use client";

import { PostsType } from "@/lib/types/post.types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import PostCard from "./PostCard";
import { getPaginatedPosts } from "@/actions/post.action";
import { useInView } from "react-intersection-observer";

function PostList({
  initialPosts,
  search = "",
}: {
  initialPosts: PostsType;
  search?: string;
}) {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", search],
      queryFn: async ({ pageParam }) => {
        return await getPaginatedPosts({
          limit: 5,
          search,
          cursor: pageParam ?? undefined,
        });
      },
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.nextCursor : undefined,
      initialData: {
        pages: [
          {
            posts: initialPosts,
            hasMore: true,
            nextCursor: initialPosts[initialPosts.length - 1]?.id, // send last id
          },
        ],
        pageParams: [null],
      },
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      <div ref={ref} className="h-10">
        {isFetchingNextPage && <p className="text-center">Loading more...</p>}
        {!hasNextPage && posts.length > 0 && (
          <p className="text-center">No more posts</p>
        )}
      </div>
    </div>
  );
}

export default PostList;
