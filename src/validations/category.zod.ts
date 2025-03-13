import { z } from "zod";

export const categoryZod = z.object({
  name: z.string().trim().min(1, { message: "Category name is required" }),
  image: z
    .string()
    .trim()
    .min(1, { message: "Image is required" })
});

export type CategoryZod = z.infer<typeof categoryZod>;
