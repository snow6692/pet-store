/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { auth, signIn, signOut } from "@/auth";
import { cachedUser } from "@/lib/cache/user.cache";
import prisma from "@/lib/db";
import { userZod } from "@/validations/user.zod";
import { User } from "@prisma/client";

export const login = async () => {
  await signIn("google");
};
export const logout = async () => {
  await signOut();
};
export const getUser = async (): Promise<User | null> => {
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

    return user || null;
  } catch (error) {
    console.error("Error fetching user from database:", error);
    return null; // Safe for prerendering
  }
};

export const updateUser = async (data: userZod) => {
  try {
    const user = await cachedUser();
    if (!user) {
      throw new Error("unAuthenticated");
    }
    const userId = user.id;
    return await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name || user.name,
        image: data.image || user.image,
        phone: data.phone || user.phone,
        address: data.address || user.address,
        city: data.city || user.city,
        state: data.state || user.state,
        postalCode: data.postalCode || user.postalCode,
        country: data.country || user.country,
      },
    });
  } catch (error: any) {
    console.log(error.message);
  }
};

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
      },
    });
    console.log("User found:", user);
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
}

export async function getUsersCount() {
  return await prisma.user.count();
}
