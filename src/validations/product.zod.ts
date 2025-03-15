import { z } from "zod";

export type ProductStatus = "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";

export const productZod = z.object({
  name: z.string().trim().min(1, { message: "Product name is required" }),
  slug: z.string().trim().min(1, { message: "Slug is required" }),
  images: z
    .array(z.string())
    .min(3, { message: "Provide at least 3 images" })
    .max(5, { message: "Cannot be more than 5 images" }),
  price: z.coerce
    .number()
    .positive({ message: "Price must be greater than 0" })
    .min(1, { message: "Enter a valid price" }),
  description: z.string().optional(),
  quantity: z.coerce.number().nonnegative().default(1),
  status: z.enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK"]),
  discount: z.coerce
    .number()
    .nonnegative()
    .min(0)
    .max(100, { message: "Discount can't be more than 100%" }),
  categoryId: z.string().uuid({ message: "Invalid category ID" }),

  brand: z.string().optional(),
  isFeatured: z.boolean().default(false),
});

export type productZod = z.infer<typeof productZod>;
