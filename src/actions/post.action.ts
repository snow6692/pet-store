// actions/post.action.ts
"use server";

import { cachedUser } from "@/lib/cache/user.cache";
import prisma from "@/lib/db";
import { postZod } from "@/validations/post.zod";
import { Prisma } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";

export async function upsertPost({ data, id }: { data: postZod; id?: string }) {
  const user = await cachedUser();
  if (!data) throw new Error("Data not found");
  if (!user) throw new Error("Unauthorized");
  const userId = user.id;

  if (id) {
    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost || existingPost.userId !== userId) {
      throw new Error("Not authorized to update this post");
    }
  }

  const post = await prisma.post.upsert({
    where: { id: id || "" },
    create: {
      title: data.title,
      description: data.description,
      image: data.image,
      userId,
    },
    update: {
      title: data.title,
      description: data.description,
      image: data.image,
    },
    include: {
      User: { select: { id: true, name: true, image: true } },
      comments: true,
      _count: { select: { upvotes: true } },
    },
  });

  revalidatePath("/community");
  revalidateTag("posts");

  return post;
}

export async function getPaginatedPosts({
  page = 1,
  limit = 5,
  search = "",
  cursor,
}: {
  page?: number;
  limit?: number;
  search?: string;
  cursor?: string;
}) {
  const user = await cachedUser();
  const skip = cursor ? 0 : (page - 1) * limit;
  try {
    const where: Prisma.PostWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const posts = await prisma.post.findMany({
      skip: cursor ? 1 : skip,
      take: limit,
      cursor: cursor ? { id: cursor } : undefined,
      where,
      orderBy: { createdAt: "desc" },
      include: {
        User: { select: { id: true, name: true, image: true } },
        comments: true,
        _count: { select: { upvotes: true } },
        upvotes: user
          ? { where: { userId: user.id }, select: { id: true } }
          : false,
      },
    });

    return {
      posts: posts.map((post) => ({
        ...post,
        isUpvoted: user ? post.upvotes.length > 0 : false,
      })),
      hasMore: posts.length === limit,
      nextCursor: posts.length ? posts[posts.length - 1].id : null,
    };
  } catch (error) {
    console.error("Error fetching paginated posts:", error);
    return { posts: [], hasMore: false, nextCursor: null };
  }
}

export async function deletePost(id: string) {
  const user = await cachedUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.post.delete({ where: { id, userId: user.id } });
}
