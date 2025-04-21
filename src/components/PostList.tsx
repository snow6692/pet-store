"use client";

import { PostsType } from "@/lib/types/post.types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import PostCard from "./PostCard";
import { getPaginatedPosts } from "@/actions/post.action";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

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
            nextCursor: initialPosts[initialPosts.length - 1]?.id ?? null,
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {posts.map((post) => (
        <motion.div key={post.id} variants={itemVariants}>
          <PostCard post={post} />
        </motion.div>
      ))}
      <div ref={ref} className="h-10">
        {isFetchingNextPage && (
          <p className="text-center text-gray-500">Loading more...</p>
        )}
        {!hasNextPage && posts.length > 0 && (
          <p className="text-center text-gray-500">No more posts</p>
        )}
      </div>
    </motion.div>
  );
}

export default PostList;
