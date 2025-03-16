"use client";
import { addToCart } from "@/actions/cart.action";
import React from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

interface IProps {
  quantity: number;
  productId: string;
}
function AddToCartButton({ productId, quantity }: IProps) {
  const handleAddToCart = async () => {
    const addToCartPromise = addToCart({ productId, quantity });
    toast.promise(addToCartPromise, {
      loading: "Adding to cart...",
      error: "Failed to add to cart",
      success: "Added to cart successfully",
    });
  };
  return (
    <Button onClick={handleAddToCart} className="mt-6 px-6 py-3 rounded-lg ">
      Add to Cart
    </Button>
  );
}

export default AddToCartButton;
