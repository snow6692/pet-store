// actions/comment.action.ts
"use server";

import prisma from "@/lib/db";
import { commentZod } from "@/validations/comment.zod";
import { cachedUser } from "@/lib/cache/user.cache";
import { NotificationEnum } from "@prisma/client";

export async function createComment({
  data,
  postId,
  parentId,
}: {
  data: typeof commentZod._type;
  postId: string;
  parentId?: string;
}) {
  const user = await cachedUser();
  if (!user) throw new Error("Unauthorized");

  const validatedData = commentZod.parse(data);

  const comment = await prisma.comment.create({
    data: {
      content: validatedData.content,
      postId,
      userId: user.id,
      parentId,
    },
    include: { user: true },
  });

  // Notify post owner if commenter is not the post owner
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (post && post.userId !== user.id) {
    await prisma.notification.create({
      data: {
        type: NotificationEnum.COMMENT,
        message: `${user.name || "Someone"} commented on your post: "${
          post.title
        }"`,
        userId: post.userId,
      },
    });
  }

  return comment;
}

export async function getComments(postId: string) {
  return await prisma.comment.findMany({
    where: { postId, parentId: null },
    include: {
      user: true,
      replies: {
        include: {
          user: true,
          replies: {
            include: { user: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
