/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ratingZod } from "@/validations/rating.zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Star } from "lucide-react";
import { STARS } from "@/lib/constants";
import { useEffect, useState } from "react";
import { createRating } from "@/actions/rating.action";
import { useQueryClient } from "@tanstack/react-query";
import { useYourRating } from "@/hooks/useYourRating";

function RatingForm({ productId }: { productId: string }) {
  const [hoverStar, setHoverStar] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { data: rating, isLoading } = useYourRating(productId);

  const form = useForm<ratingZod>({
    resolver: zodResolver(ratingZod),
    defaultValues: {
      comment: "",
      rating: 0,
    },
  });

  const { data: yourRating } = useYourRating(productId);

  useEffect(() => {
    if (!yourRating) {
      form.reset({
        rating: 0,
        comment: "",
      });
    }
  }, [yourRating, form]);
  useEffect(() => {
    if (rating) {
      form.reset({
        comment: rating.comment || "",
        rating: rating.rating || 1,
      });
    }
  }, [rating, form]);

  const onSubmit = async (data: ratingZod) => {
    try {
      const ratingPromise = createRating({ data, productId });
      await toast.promise(ratingPromise, {
        loading: "Loading...",
        success: "Rating submitted successfully",
        error: "Error submitting rating, try again later",
      });

      await queryClient.invalidateQueries({
        queryKey: ["your-rating", productId],
      });
      await queryClient.invalidateQueries({ queryKey: ["rating", productId] });
      await queryClient.invalidateQueries({
        queryKey: ["your-rating", productId],
      });
    } catch (error: any) {
      toast.error("Something went wrong. Please try again later.");
      console.error(error);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-1">
                  {STARS.map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 cursor-pointer transition ${
                        star <= field.value
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-400"
                      } ${
                        star <= hoverStar! || star <= field.value
                          ? "fill-yellow-300 text-yellow-300"
                          : ""
                      }`}
                      onClick={() => field.onChange(star)}
                      onMouseEnter={() => setHoverStar(star)}
                      onMouseLeave={() => setHoverStar(null)}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Textarea placeholder="Write your thoughts..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Submitting..." : "Submit Rating"}
        </Button>
      </form>
    </Form>
  );
}

export default RatingForm;
