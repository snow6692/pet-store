"use client";

import { getCartItems, clearCart } from "@/actions/cart.action";
import CartItem from "@/components/CartItem";
import CartItemSkeleton from "@/components/CartItemSkeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ConfirmDeleteCartItem from "@/components/dialogs/ConfirmDeleteCartItem";
import CheckoutDialog from "@/components/dialogs/CheckoutDialog";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";

export default function CartPage() {
  const queryClient = useQueryClient();

  const {
    data: cartItems = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: getCartItems,
  });

  const clearCartMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cartCount"] });
      toast.success("Cart cleared successfully! 🌟");
    },
    onError: () => toast.error("Failed to clear cart. Please try again."),
  });

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="relative border-none shadow-xl bg-background/95 backdrop-blur-sm max-w-5xl mx-auto overflow-hidden">
          {/* Gradient Border Accent */}
          <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg pointer-events-none" />
          <CardHeader>
            <CardTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Your Cart
            </CardTitle>
            <p className="text-lg text-muted-foreground">
              Review your items and proceed to checkout
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <CartItemSkeleton key={index} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-destructive text-lg font-semibold">
                  Error loading cart. Please try again later.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 border-muted/50 hover:bg-muted/50 transition-colors duration-300"
                  onClick={() =>
                    queryClient.invalidateQueries({ queryKey: ["cart"] })
                  }
                >
                  Retry
                </Button>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg font-semibold">
                  Your cart is empty
                </p>
                <p className="text-muted-foreground mt-2">
                  Explore our products and add some items!
                </p>
                <Link href="/products/1">
                  <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 animate-pulse-subtle">
                    Shop Now
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="group"
                    >
                      <CartItem item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>

                <Separator className="bg-gradient-to-r from-muted/30 to-muted/50" />

                <motion.div
                  key={totalPrice}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col sm:flex-row justify-between items-center pt-4 gap-4"
                >
                  <h2 className="text-xl font-semibold text-foreground">
                    Total Price:
                  </h2>
                  <p className="text-2xl font-bold text-primary">
                    ${totalPrice.toFixed(2)}
                  </p>
                </motion.div>

                <div className="flex flex-col sm:flex-row  justify-center  gap-12 mt-6 ">
                  <CheckoutDialog>
                    <Button
                      asChild
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transition-all duration-300 animate-pulse-subtle text-lg font-semibold"
                    >
                      <div className=" w-[360px] ">Checkout</div>
                    </Button>
                  </CheckoutDialog>
                  <ConfirmDeleteCartItem
                    onDelete={() => clearCartMutation.mutate()}
                  >
                    <Button
                      disabled={clearCartMutation.isPending}
                      variant="destructive"
                      className=" w-[240px] bg-red-500 hover:bg-red-600 text-white transition-all duration-300 animate-pulse-subtle"
                    >
                      {clearCartMutation.isPending ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Clearing...
                        </>
                      ) : (
                        "Clear Cart"
                      )}
                    </Button>
                  </ConfirmDeleteCartItem>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
