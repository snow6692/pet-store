import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CheckoutForm from "../forms/CheckoutForm"; // الفورم الموحد
// import { createOrder } from "@/actions/order.action"; // API لإنشاء الأوردر

function CheckoutDialog({ children }: { children: ReactNode }) {
  const handleCOD = async () => {
    // await createOrder(userData, "cash_on_delivery"); // حفظ الأوردر كـ COD
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

        <CheckoutForm />

        <div className="flex flex-col gap-4">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white w-full"
            onClick={() => console.log("Redirect to Stripe Payment")}
          >
            Pay with Visa 💳
          </Button>

          <Button
            className="bg-gray-700 hover:bg-gray-800 text-white w-full"
            onClick={handleCOD}
          >
            Pay on Delivery 🚚
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CheckoutDialog;
