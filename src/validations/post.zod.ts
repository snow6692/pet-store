import { z } from "zod";

export const postZod = z.object({
  title: z.string().min(3, "Title at least 3 character"),
  description: z.string().optional(),
  image: z.string().optional(),
});

export type postZod = z.infer<typeof postZod>;
