"use client";
import { getCartItems, clearCart } from "@/actions/cart.action";
import CartItem from "../../../components/CartItem";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import ConfirmDeleteCartItem from "@/components/dialogs/ConfirmDeleteCartItem";
import CheckoutDialog from "@/components/dialogs/CheckoutDialog";

export default function CartPage() {
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCartItems,
  });

  const clearCartMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cartCount"] });
    },
  });
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}

          <div className="flex justify-between items-center border-t pt-4">
            <h2 className="text-xl font-semibold">Total Price:</h2>
            <p className="text-lg font-bold">${totalPrice.toFixed(2)}</p>
          </div>
          <div className=" flex justify-between">
            <ConfirmDeleteCartItem onDelete={() => clearCartMutation.mutate()}>
              <Button
                disabled={clearCartMutation.isPending}
                className=" px-4 py-2 rounded hover:bg-red-600 bg-red-500"
              >
                {clearCartMutation.isPending ? "Clearing..." : "Clear Cart"}
              </Button>
            </ConfirmDeleteCartItem>
            <CheckoutDialog>
              <Button asChild className=" bg-green-500 hover:bg-green-600">
                <span>Checkout</span>
              </Button>
            </CheckoutDialog>
          </div>
        </div>
      )}
    </div>
  );
}
