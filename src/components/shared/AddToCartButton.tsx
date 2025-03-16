"use client";
import { addToCart } from "@/actions/cart.action";
import React from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface IProps {
  quantity: number;
  productId: string;
}

function AddToCartButton({ productId, quantity }: IProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => await addToCart({ productId, quantity }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["cartCount", "cart"] });
      const previousCartCount = queryClient.getQueryData<number>(["cartCount"]);

      queryClient.setQueryData(
        ["cartCount"],
        (oldCount: number | undefined) => (oldCount ?? 0) + quantity
      );

      return { previousCartCount };
    },
    onSuccess: () => {
      toast.success("Added to cart successfully");
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["cartCount"], context?.previousCartCount);
      toast.error("Failed to add to cart");
    },
  });

  return (
    <Button
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className="mt-6 px-6 py-3 rounded-lg"
    >
      {mutation.isPending ? "Adding to cart..." : "Add to cart"}
    </Button>
  );
}

export default AddToCartButton;
