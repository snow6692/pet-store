// actions/notification.action.ts
"use server";

import prisma from "@/lib/db";
import { cachedUser } from "@/lib/cache/user.cache";

export async function getNotifications() {
  const user = await cachedUser();
  if (!user) throw new Error("Unauthorized");

  return await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}

export async function markNotificationAsRead(id: string) {
  const user = await cachedUser();
  if (!user) throw new Error("Unauthorized");

  return await prisma.notification.update({
    where: { id, userId: user.id },
    data: { isRead: true },
  });
}
