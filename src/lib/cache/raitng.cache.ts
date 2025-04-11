import { cache } from "./cache";
import { MONTH } from "../constants";
import { getYourRating } from "@/actions/rating.action";

export const getYourCachedRating = cache(
    getYourRating ,
  ["rating"],
  {
    tags: ["rating"],
    revalidate: MONTH,
  }
);
