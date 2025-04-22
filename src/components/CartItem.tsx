"use client";
import { cartItemType } from "@/lib/types/cartTypes";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCartItemQuantity, removeCartItem } from "@/actions/cart.action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ConfirmDeleteCartItem from "@/components/dialogs/ConfirmDeleteCartItem";
import { Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

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
      toast.success("Quantity updated successfully! 🌟");
    },
    onError: (_error, _newQuantity, context) => {
      queryClient.setQueryData(["cart"], context?.previousCart);
      toast.error("Failed to update quantity. Please try again.");
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
      toast.success("Item removed from cart! 🌟");
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["cart"], context?.previousCart);
      toast.error("Failed to remove item. Please try again.");
    },
  });

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="flex items-center gap-4 p-4 border-none shadow-sm bg-background/95 backdrop-blur-sm group transition-all duration-300 hover:shadow-md">
        {/* Image */}
        <div className="relative h-20 w-20 rounded-md overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
          <Image
            src={item.product.images[0] || "/placeholder.png"}
            alt={item.product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="80px"
          />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-1">
          <h2 className="text-lg font-semibold text-foreground line-clamp-1">
            {item.product.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            ${item.product.price.toFixed(2)} × {item.quantity} ={" "}
            <span className="font-semibold text-primary">
              ${(item.product.price * item.quantity).toFixed(2)}
            </span>
          </p>
          {item.product.quantity < 5 && (
            <p className="text-sm text-destructive">
              Only {item.product.quantity} left in stock
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <motion.div
            key={item.quantity}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1"
          >
            <Button
              variant={"destructive"}
              onClick={() => updateQuantityMutation.mutate(item.quantity - 1)}
              disabled={updateQuantityMutation.isPending || item.quantity === 1}
              className="h-8 w-8 bg-gradient-to-r  bg-red-500 text-foreground rounded-full transition-all duration-300 disabled:opacity-50"
            >
              {updateQuantityMutation.isPending &&
              updateQuantityMutation.variables === item.quantity - 1 ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "-"
              )}
            </Button>
            <span className="text-sm font-semibold text-foreground w-8 text-center">
              {item.quantity}
            </span>
            <Button
              onClick={() => updateQuantityMutation.mutate(item.quantity + 1)}
              disabled={
                updateQuantityMutation.isPending || item.quantity >= maxQuantity
              }
              className="h-8 w-8 bg-gradient-to-r  bg-green-500 hover:bg-green-600 text-foreground rounded-full transition-all duration-300 disabled:opacity-50"
            >
              {updateQuantityMutation.isPending &&
              updateQuantityMutation.variables === item.quantity + 1 ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "+"
              )}
            </Button>
          </motion.div>
          <ConfirmDeleteCartItem onDelete={() => removeItemMutation.mutate()}>
            <Button
              disabled={removeItemMutation.isPending}
              variant="ghost"
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-all duration-300"
            >
              {removeItemMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </ConfirmDeleteCartItem>
        </div>
      </Card>
    </motion.div>
  );
}

export default CartItem;
