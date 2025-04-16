"use server";
import { cachedUser } from "@/lib/cache/user.cache";
import prisma from "@/lib/db";
import { postZod } from "@/validations/post.zod";
import { Prisma } from "@prisma/client";
import { revalidateTag } from "next/cache";

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
    where: { id },
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
  });

  revalidateTag("posts");

  return post;
}

// export async function getPaginatedPosts(page = 1, limit = 5) {
//   const skip = (page - 1) * limit;
//   try {
//     const posts = await prisma.post.findMany({
//       skip,
//       take: limit,
//       orderBy: {
//         createdAt: "desc",
//       },
//       include: {
//         User: true,
//         comments: true,
//         _count: {
//           select: {
//             upvotes: true,
//           },
//         },
//       },
//     });

//     const total = await prisma.post.count();

//     return {
//       posts,
//       hasMore: skip + limit < total,
//     };
//   } catch (error) {
//     console.error("Error fetching paginated posts:", error);
//     return {
//       posts: [],
//       hasMore: false,
//     };
//   }
// }

// actions/post.action.ts

export async function getPaginatedPosts({
  page = 1,
  limit = 5,
  search = "",
  cursor, //last id example post 5
}: {
  page?: number;
  limit?: number;
  search?: string;
  cursor?: string;
}) {
  const skip = cursor ? 0 : (page - 1) * limit;
  try {
    const where: Prisma.PostWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const posts = await prisma.post.findMany({
      skip: cursor ? 1 : skip, // 2- if there's a cursor skip him and start with the next after him
      take: limit,
      cursor: cursor ? { id: cursor } : undefined, //  1- If there's cursor start with him
      where,
      orderBy: { createdAt: "desc" },
      include: {
        User: true,
        comments: true,
        _count: { select: { upvotes: true } },
      },
    });

    // const total = await prisma.post.count({ where });

    return {
      posts,
      hasMore: posts.length === limit,
      nextCursor: posts.length ? posts[posts.length - 1].id : null, // take last post id
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
