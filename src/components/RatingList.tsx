"use client";

import { getRatingsForProduct, deleteRating } from "@/actions/rating.action";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Star, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import ConfirmDeleteDialog from "./dialogs/ConfirmDeleteDialog";

function RatingList({ productId }: { productId: string }) {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();

  const {
    data: ratings = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["rating", productId],
    queryFn: () => getRatingsForProduct({ productId }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRating({ id }),
    onSuccess: () => {
      toast.success("Rating deleted successfully! 🌟");
      queryClient.invalidateQueries({ queryKey: ["rating", productId] });
      queryClient.invalidateQueries({ queryKey: ["your-rating", productId] });
    },
    onError: () => toast.error("Failed to delete rating. Please try again."),
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <Card className="border-none shadow-lg bg-background/95 backdrop-blur-sm">
        <CardContent className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground mt-3 text-lg">
            Loading ratings...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-none shadow-lg bg-background/95 backdrop-blur-sm">
        <CardContent className="text-center py-8">
          <p className="text-destructive text-lg font-semibold">
            Something went wrong. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!ratings || ratings.length === 0) {
    return (
      <Card className="border-none shadow-lg bg-background/95 backdrop-blur-sm">
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground text-lg">
            No ratings yet. Be the first to share your feedback!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {ratings.map((rating, index) => {
        const isOwner = currentUser?.id === rating.user.id;
        const dateToShow = rating.updatedAt ?? rating.createdAt;

        return (
          <Card
            key={rating.id}
            className="group relative overflow-hidden border-none shadow-md bg-background/95 backdrop-blur-sm transition-all duration-300 hover:shadow-xl animate-slide-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient Border Accent */}
            <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg pointer-events-none" />
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                    <AvatarImage
                      src={rating.user.image || ""}
                      alt={rating.user.name || "User"}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {rating.user.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-semibold text-lg text-foreground">
                      {rating.user.name || "Anonymous"}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(dateToShow), "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>

                {isOwner && (
                  <ConfirmDeleteDialog
                    onDelete={(id) => handleDelete(id)}
                    id={rating.id}
                    name=""
                  >
                    <Trash2 className="h-5 w-5 text-red-500 hover:text-red-600 cursor-pointer transition-colors duration-200 hover:scale-110" />
                  </ConfirmDeleteDialog>
                )}
              </div>

              <div className="flex items-center space-x-1 group">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    className={cn(
                      "h-5 w-5 transition-all duration-200 group-hover:scale-110",
                      index < rating.rating
                        ? "fill-yellow-400 text-yellow-400 drop-shadow-glow"
                        : "text-muted-foreground/50"
                    )}
                  />
                ))}
              </div>

              <Separator className="bg-gradient-to-r from-muted/30 to-muted/50" />

              <p className="text-base text-foreground leading-relaxed">
                {rating.comment || "No comment provided."}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default RatingList;
