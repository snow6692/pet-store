import { z } from "zod";

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
  description: z.string().optional().nullable(),
  quantity: z.coerce.number().nonnegative().default(1),
  status: z.enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK"]),
  discount: z.coerce.number().nonnegative().optional().nullable(),
  brand: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
});

export type productZod = z.infer<typeof productZod>;
