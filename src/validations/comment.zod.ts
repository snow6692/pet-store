import { z } from "zod";

export const commentZod = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment is too long"),
});
export type commentZod = z.infer<typeof commentZod>;
