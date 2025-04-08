import { z } from "zod";
export const ratingZod = z.object({
  rating: z
    .number()
    .min(1, "Minimum rating is 1")
    .max(5, "Maximum rating is 5"),
  comment: z.string().max(300, "Comment too long").optional(),
});
export type ratingZod = z.infer<typeof ratingSchema>;
