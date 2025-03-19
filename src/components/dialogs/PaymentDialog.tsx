import React, { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

function PaymentDialog({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger>
        <span>{children}</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Visa Payment Details</DialogTitle>
        </DialogHeader>

        <p className="text-gray-600">Please enter your Visa card details.</p>
      </DialogContent>
    </Dialog>
  );
}

export default PaymentDialog;
