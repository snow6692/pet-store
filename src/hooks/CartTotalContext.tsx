"use client";

import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCartItems } from "@/actions/cart.action";

const CartTotalContext = createContext<number>(0);

export function CartTotalProvider({ children }: { children: React.ReactNode }) {
  const { data: cartItems = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: getCartItems,
  });

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartTotalContext.Provider value={totalPrice}>
      {children}
    </CartTotalContext.Provider>
  );
}

export function useCartTotal() {
  return useContext(CartTotalContext);
}
