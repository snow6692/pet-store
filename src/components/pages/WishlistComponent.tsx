"use client";

import { getWishlist, removeAllWishlist } from "@/actions/wishlist.action";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProductCard from "../cards/ProductCard";
import { Button } from "../ui/button";
import ConfirmDeleteCartItem from "../dialogs/ConfirmDeleteCartItem";

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
    },
  });

  if (isLoading) return <p>Loading wishlist...</p>;
  if (error) return <p>Error loading wishlist</p>;
  if (!data || !data.items.length) return <p>Your wishlist is empty</p>;

  return (
    <div className="flex flex-col gap-5">
      <ConfirmDeleteCartItem onDelete={() => mutation.mutate()}>
        <div className="place-items-center">
          <Button className="flex hover:bg-red-500">Remove all</Button>
        </div>
      </ConfirmDeleteCartItem>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.items.map((item) => (
          <ProductCard key={item.product.id} product={item.product} />
        ))}
      </div>
    </div>
  );
}

export default WishlistComponent;
