"use server";

import { cachedUser } from "@/lib/cache/user.cache";
import prisma from "@/lib/db";
import { ratingZod } from "@/validations/rating.zod";
import { revalidateTag } from "next/cache";

// Reusable function to update product rating
async function updateProductRating(productId: string) {
  const aggregate = await prisma.rating.aggregate({
    where: { productId },
    _avg: { rating: true },
  });

  const averageRating = aggregate._avg.rating || 0;

  await prisma.product.update({
    where: { id: productId },
    data: { rating: averageRating },
  });

  revalidateTag("rating");
  revalidateTag("your-rating");
  revalidateTag("products");
}

//Create, update and calc average of the rating
export async function createRating({
  data,
  productId,
}: {
  data: ratingZod;
  productId: string;
}) {
  const user = await cachedUser();
  if (!user) return;

  const userId = user.id;
  const parsedData = ratingZod.parse(data);

  // Check for existing rating
  const existingRating = await prisma.rating.findUnique({
    where: { productId_userId: { productId, userId } },
  });

  if (existingRating) {
    // Update existing rating
    const updatedRating = await prisma.rating.update({
      where: { id: existingRating.id },
      data: {
        rating: parsedData.rating,
        comment: parsedData.comment,
        updatedAt: new Date(),
      },
    });

    await updateProductRating(productId);
    return updatedRating;
  } else {
    // Create new rating
    const newRating = await prisma.rating.create({
      data: {
        ...parsedData,
        productId,
        userId,
      },
    });

    await updateProductRating(productId);
    return newRating;
  }
}


export async function deleteRating({ id }: { id: string }) {
  const user = await cachedUser();
  if (!user) return;

  const userId = user.id;

  // Get rating before deletion to get productId
  const rating = await prisma.rating.findUnique({
    where: { id },
  });

  if (!rating || rating.userId !== userId) return;

  const deletedRating = await prisma.rating.delete({
    where: { id },
  });

  await updateProductRating(rating.productId); // 🛠️ Recalculate average

  return deletedRating;
}

export async function getYourRating({ productId }: { productId: string }) {
  const user = await cachedUser();
  if (!user) return;
  const userId = user.id;
  const rating = await prisma.rating.findUnique({
    where: {
      productId_userId: { userId, productId },
    },
  });
  return rating;
}

export async function getRatingsForProduct({
  productId,
}: {
  productId: string;
}) {
  const user = await cachedUser();
  const userId = user?.id;

  const ratings = await prisma.rating.findMany({
    where: {
      productId,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
          id: true,
        },
      },
    },
  });

  if (!userId) return ratings;

  const userRating = ratings.find((r) => r.userId === userId);
  const otherRatings = ratings.filter((r) => r.userId !== userId);

  return userRating ? [userRating, ...otherRatings] : ratings;
}
