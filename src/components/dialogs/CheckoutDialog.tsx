import { ReactNode } from "react";
import { placeOrder } from "@/actions/order.action";
import { toast } from "react-hot-toast";
import CheckoutForm from "../forms/CheckoutForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { orderZod } from "@/validations/order.zod";
import { useQueryClient } from "@tanstack/react-query";

function CheckoutDialog({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const handleCashOnDelivery = async (data: orderZod) => {
    const promise = placeOrder(data);

    toast.promise(promise, {
      loading: "Creating order...",
      error: "Failed to make an order",
      success: "Order Created Successfully!",
    });
    if ((await promise).success) {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cartCount"] });
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <span>{children}</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose Payment Method</DialogTitle>
        </DialogHeader>

        <CheckoutForm onSubmit={handleCashOnDelivery} />
      </DialogContent>
    </Dialog>
  );
}

export default CheckoutDialog;
