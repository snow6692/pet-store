/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { addToWishlist, getWishlist } from "@/actions/wishlist.action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import React from "react";

function WishlistIcon({ productId }: { productId: string }) {
  const queryClient = useQueryClient();

  const { data: wishlist } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
  });

  const isInWishlist = wishlist?.items?.some(
    (item: any) => item.product.id === productId
  );

  const mutation = useMutation({
    mutationFn: () => addToWishlist(productId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      const previousWishlist = queryClient.getQueryData(["wishlist"]);

      queryClient.setQueryData(["wishlist"], (oldData: any) => {
        if (!oldData) return { items: [{ product: { id: productId } }] };

        const exists = oldData.items.some(
          (item: any) => item.product.id === productId
        );

        return {
          ...oldData,
          items: exists
            ? oldData.items.filter((item: any) => item.product.id !== productId) //  Remove item
            : [...oldData.items, { product: { id: productId } }], // Add item
        };
      });

      return { previousWishlist };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(["wishlist"], context.previousWishlist);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  return (
    <Heart
      onClick={() => mutation.mutate()}
      className={`absolute top-2 right-2 cursor-pointer ${
        isInWishlist ? "text-red-500 fill-red-500" : "text-gray-400"
      }`}
      size={24}
    />
  );
}

export default WishlistIcon;
