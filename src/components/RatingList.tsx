"use client";

import { getRatingsForProduct, deleteRating } from "@/actions/rating.action";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "./shared/Loader";
import { format } from "date-fns";
import { Star, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Image from "next/image";
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
      toast.success("Rating deleted");
      queryClient.invalidateQueries({ queryKey: ["rating", productId] });
      queryClient.invalidateQueries({ queryKey: ["your-rating", productId] });
    },
    onError: () => toast.error("Failed to delete rating"),
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (error)
    return <p className="text-red-500">Something went wrong. Try again.</p>;
  if (isLoading) return <Loader />;
  if (!ratings || ratings.length === 0)
    return <p className="text-muted-foreground">No ratings yet.</p>;

  return (
    <div className="space-y-4">
      {ratings?.map((rating) => {
        const isOwner = currentUser?.id === rating.user.id;
        const dateToShow = rating.updatedAt ?? rating.createdAt;

        return (
          <Card key={rating.id} className="p-4 shadow-sm border">
            <CardContent className="space-y-2 p-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Image
                    src={rating.user.image || ""}
                    alt={rating.user.name || "User name"}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                  <span className="font-medium">{rating.user.name}</span>
                </div>

                {isOwner && (
                  <ConfirmDeleteDialog
                    onDelete={(id) => handleDelete(id)}
                    id={rating.id}
                    name=""
                  >
                    <Trash2 className="h-5 w-5 text-red-500 hover:text-red-600 cursor-pointer" />
                  </ConfirmDeleteDialog>
                )}
              </div>

              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    className={cn(
                      "h-5 w-5",
                      index < rating.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>

              <p className="text-sm text-muted-foreground">
                {format(new Date(dateToShow), "MMMM d, yyyy")}
              </p>

              <Separator />

              <p className="text-base">{rating.comment}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default RatingList;
