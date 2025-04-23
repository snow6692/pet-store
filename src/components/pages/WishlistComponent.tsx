"use client";

import { getWishlist, removeAllWishlist } from "@/actions/wishlist.action";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProductCard from "../cards/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ConfirmDeleteCartItem from "../dialogs/ConfirmDeleteCartItem";
import { Heart, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Loader from "../shared/Loader";

function WishlistComponent() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
  });

  const mutation = useMutation({
    mutationFn: removeAllWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Wishlist cleared successfully! 🌟");
    },
    onError: () => toast.error("Failed to clear wishlist. Please try again."),
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Card className="border-none shadow-lg bg-background/95 backdrop-blur-sm">
        <CardContent className="text-center py-8">
          <p className="text-destructive text-lg font-semibold">
            Error loading wishlist. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.items.length) {
    return (
      <Card className="border-none shadow-lg bg-background/95 backdrop-blur-sm">
        <CardContent className="text-center py-8">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg font-semibold">
            Your wishlist is empty
          </p>
          <p className="text-muted-foreground mt-2">
            Add some products to your wishlist to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-lg bg-background/95 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Your Wishlist
        </CardTitle>
        <ConfirmDeleteCartItem onDelete={() => mutation.mutate()}>
          <Button
            variant="destructive"
            className="bg-red-500 hover:bg-red-600 text-white transition-all duration-300"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Clearing...
              </>
            ) : (
              "Clear Wishlist"
            )}
          </Button>
        </ConfirmDeleteCartItem>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((item) => (
            <div
              key={item.product.id}
              className="transition-transform duration-300 hover:scale-105"
            >
              <ProductCard product={item.product} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default WishlistComponent;
