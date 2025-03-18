import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

function CheckoutDialog({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger>
        <span>{children}</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose Payment Method</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white w-full"
            onClick={() => console.log("Redirect to Visa Payment")}
          >
            Pay with Visa 💳
          </Button>
          
          <Button
            className="bg-gray-700 hover:bg-gray-800 text-white w-full"
            onClick={() => console.log("Cash on Delivery Selected")}
          >
            Pay on Delivery 🚚
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CheckoutDialog;
