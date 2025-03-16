"use server";
import { auth, signIn, signOut } from "@/auth";
import prisma from "@/lib/db";

export const login = async () => {
  await signIn("google");
};
export const logout = async () => {
  await signOut();
};
export const getUser = async () => {
  try {
    const session = await auth();

    const userId = session?.user?.id;
    if (!userId) {
      console.warn("No user ID found in session.");
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user from database:", error);
    return null;
  }
};
