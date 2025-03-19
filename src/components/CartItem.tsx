"use client";
import { cartItemType } from "@/lib/types/cartTypes";
import Image from "next/image";
import React from "react";
import { updateCartItemQuantity, removeCartItem } from "@/actions/cart.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import ConfirmDeleteCartItem from "@/components/dialogs/ConfirmDeleteCartItem";

interface IProps {
  item: cartItemType;
}

function CartItem({ item }: IProps) {
  const queryClient = useQueryClient();
  const maxQuantity = item.product.quantity;

  const updateQuantityMutation = useMutation({
    mutationFn: (newQuantity: number) =>
      updateCartItemQuantity(item.id, newQuantity),
    onMutate: async (newQuantity) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousCart = queryClient.getQueryData<cartItemType[]>(["cart"]);
      queryClient.setQueryData<cartItemType[]>(["cart"], (oldCart) =>
        oldCart
          ? oldCart.map((cartItem) =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: newQuantity }
                : cartItem
            )
          : []
      );

      return { previousCart };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cartCount"] });
    },
    onError: (_error, _newQuantity, context) => {
      queryClient.setQueryData(["cart"], context?.previousCart);
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: () => removeCartItem(item.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousCart = queryClient.getQueryData<cartItemType[]>(["cart"]);
      queryClient.setQueryData<cartItemType[]>(["cart"], (oldCart) =>
        oldCart ? oldCart.filter((cartItem) => cartItem.id !== item.id) : []
      );

      return { previousCart };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cartCount"] });
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["cart"], context?.previousCart);
    },
  });

  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <Image
        src={item.product.images[0]}
        alt={item.product.name}
        width={50}
        height={50}
        className="size-20 object-cover rounded"
      />
      <div className="flex-1">
        <h2 className="text-lg font-semibold">{item.product.name}</h2>
        <p className="text-gray-600">Quantity: {item.quantity}</p>
        <p className="text-gray-800 font-bold">${item.product.price}</p>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => updateQuantityMutation.mutate(item.quantity - 1)}
          disabled={updateQuantityMutation.isPending || item.quantity === 1}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          -
        </Button>
        <Button
          onClick={() => updateQuantityMutation.mutate(item.quantity + 1)}
          disabled={
            updateQuantityMutation.isPending || item.quantity >= maxQuantity
          }
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          +
        </Button>
        <ConfirmDeleteCartItem onDelete={() => removeItemMutation.mutate()}>
          <Button
            disabled={removeItemMutation.isPending}
            className="text-red-500 hover:text-red-700"
          >
            Remove
          </Button>
        </ConfirmDeleteCartItem>
      </div>
    </div>
  );
}

export default CartItem;
