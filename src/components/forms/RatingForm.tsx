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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import { Star, Loader2, X } from "lucide-react";
import { STARS } from "@/lib/constants";
import { useEffect, useState } from "react";
import { createRating } from "@/actions/rating.action";
import { useQueryClient } from "@tanstack/react-query";
import { useYourRating } from "@/hooks/useYourRating";
import { cn } from "@/lib/utils";

function RatingForm({ productId }: { productId: string }) {
  const [hoverStar, setHoverStar] = useState<number | null>(null);
  const [charCount, setCharCount] = useState(0);
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
      setCharCount(0);
    }
  }, [yourRating, form]);

  useEffect(() => {
    if (rating) {
      form.reset({
        comment: rating.comment || "",
        rating: rating.rating || 1,
      });
      setCharCount(rating.comment?.length || 0);
    }
  }, [rating, form]);

  const onSubmit = async (data: ratingZod) => {
    try {
      const ratingPromise = createRating({ data, productId });
      await toast.promise(ratingPromise, {
        loading: "Submitting your rating...",
        success: "Rating submitted successfully! 🌟",
        error: "Failed to submit rating. Please try again.",
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

  const handleReset = () => {
    form.reset({ rating: 0, comment: "" });
    setHoverStar(null);
    setCharCount(0);
  };

  if (isLoading) {
    return (
      <Card className="border-none shadow-lg bg-background/95 backdrop-blur-sm">
        <CardContent className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground mt-3 text-lg">
            Loading rating form...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative border-none shadow-xl bg-background/95 backdrop-blur-sm overflow-hidden">
      {/* Gradient Border Accent */}
      <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg pointer-events-none" />
      <CardHeader className="pb-4">
        <CardTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Share Your Feedback
        </CardTitle>
        <p className="text-lg text-muted-foreground">
          Tell us what you love (or don’t) about this product!
        </p>
      </CardHeader>
      <CardContent className="relative">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Rating Field */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-foreground">
                    Your Rating
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-3">
                      {STARS.map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "h-9 w-9 cursor-pointer transition-all duration-300",
                            star <= field.value
                              ? "fill-yellow-400 text-yellow-400 drop-shadow-glow"
                              : "text-muted-foreground/50",
                            star <= (hoverStar ?? field.value)
                              ? "scale-125 fill-yellow-300 text-yellow-300 drop-shadow-glow"
                              : "scale-100"
                          )}
                          onClick={() => field.onChange(star)}
                          onMouseEnter={() => setHoverStar(star)}
                          onMouseLeave={() => setHoverStar(null)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage className="text-sm text-destructive mt-2" />
                  {/* Rating Preview */}
                  {field.value > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      You rated: {field.value}{" "}
                      {field.value === 1 ? "star" : "stars"}
                    </p>
                  )}
                </FormItem>
              )}
            />

            {/* Comment Field */}
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-foreground">
                    Your Comment
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder="Share your thoughts about the product..."
                        className="min-h-[140px] resize-y border-muted/50 focus:border-primary/70 bg-background/50 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                        maxLength={500}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setCharCount(e.target.value.length);
                        }}
                      />
                      <p className="absolute bottom-3 right-3 text-sm text-muted-foreground">
                        {charCount}/500
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage className="text-sm text-destructive" />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="flex-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-subtle"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit Rating"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={form.formState.isSubmitting}
                className="flex-1 border-muted/50 text-muted-foreground hover:bg-muted/50 transition-colors duration-300"
              >
                <X className="h-5 w-5 mr-2" />
                Clear
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default RatingForm;
