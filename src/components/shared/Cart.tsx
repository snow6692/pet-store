"use client";
import Link from "next/link";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getCartCount } from "@/actions/cart.action";

function Cart() {
  const { data: cartCount = 0, refetch } = useQuery({
    queryKey: ["cartCount"],
    queryFn: getCartCount,
  });

  return (
    <Link href="/cart" className="relative">
      <span className="text-gray-700 hover:text-blue-600 text-lg">🛒</span>
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
          {cartCount}
        </span>
      )}
    </Link>
  );
}

export default Cart;
