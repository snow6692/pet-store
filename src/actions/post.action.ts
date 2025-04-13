"use server";
import { cachedUser } from "@/lib/cache/user.cache";
import prisma from "@/lib/db";
import { postZod } from "@/validations/post.zod";

export async function upsertPost({ data, id }: { data: postZod; id?: string }) {
  const user = await cachedUser();
  if (!data) throw new Error("Data not found");
  if (!user) throw new Error("Unauthorized");
  const userId = user.id;

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

  return post;
}

export async function getPaginatedPosts(page = 1, limit = 5) {
  const skip = (page - 1) * limit;
  try {
    const posts = await prisma.post.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        User: true,
        comments: true,
        _count: {
          select: {
            upvotes: true,
          },
        },
      },
    });

    const total = await prisma.post.count();

    return {
      posts,
      hasMore: skip + limit < total,
    };
  } catch (error) {
    console.error("Error fetching paginated posts:", error);
    return {
      posts: [],
      hasMore: false,
    };
  }
}
