"use server";

import prisma from "@/lib/db";
import { cachedUser } from "@/lib/cache/user.cache";
import { NotificationEnum } from "@prisma/client";

export async function createUpvote(postId: string) {
  const user = await cachedUser();
  if (!user) throw new Error("Unauthorized");

  const existingUpvote = await prisma.upvote.findUnique({
    where: { userId_postId: { userId: user.id, postId } },
  });

  if (existingUpvote) {
    await prisma.upvote.delete({ where: { id: existingUpvote.id } });
    console.log(`Upvote removed for post ${postId} by user ${user.id}`); // Debug log
    return { upvoted: false };
  }

  const upvote = await prisma.upvote.create({
    data: { userId: user.id, postId },
  });

  // Notify post owner if upvoter is not the post owner
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (post && post.userId !== user.id) {
    await prisma.notification.create({
      data: {
        type: NotificationEnum.UPVOTE,
        message: `${user.name || "Someone"} liked your post: "${post.title}"`,
        userId: post.userId,
      },
    });
  }

  console.log(`Upvote added for post ${postId} by user ${user.id}`); // Debug log
  return { upvote, upvoted: true };
}
