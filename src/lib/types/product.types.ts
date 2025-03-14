import { Prisma } from "@prisma/client";

export type ProductWithCategories = Prisma.ProductGetPayload<{
  include: { category: true };
}>;
