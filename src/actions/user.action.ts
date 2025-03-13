"use server";
import { auth } from "@/auth";
import prisma from "@/lib/db";
import { revalidateTag } from "next/cache";

export const getUser = async () => {
  try {
    const session = await auth();
    console.log("Session Data:", session); //ت

    const userId = session?.user?.id;
    if (!userId) {
      console.warn("No user ID found in session.");
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    console.log("Fetched User from DB:", user);
    return user;
  } catch (error) {
    console.error("Error fetching user from database:", error);
    return null;
  }
};
