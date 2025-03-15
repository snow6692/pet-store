import {  Prisma } from "@prisma/client";

export type ProductWithCategories = Prisma.ProductGetPayload<{
  include: { category: true };
}>;

export type ProductWithCategoriesTable = {
  id: string;
  name: string;
  slug: string;
  images: string[];
  price: number;
  description: string | null;
  quantity: number;
  status: string;
  discount: number | null;
  rating: number;
  brand: string | null;
  isFeatured: boolean;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
    image: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  };
};
