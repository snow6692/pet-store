import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { Card, CardTitle } from "../ui/card";
import Image from "next/image";
import { orderItemWithProduct } from "@/lib/types/order.types";

function OrderProductsDialog({
  children,
  items,
}: {
  children: ReactNode;
  items: orderItemWithProduct[];
}) {
  return (
    <Dialog>
      <DialogTrigger className="text-blue-500 hover:underline">
        <>{children}</>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order Products</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="flex gap-4 p-4">
              <Image
                src={item.product.images[0] || "/placeholder.png"}
                alt={item.product.name}
                width={40}
                height={40}
                className="w-20 h-20 object-cover rounded-md"
              />

              <div>
                <CardTitle className="text-lg">{item.product.name}</CardTitle>
                <p className="text-gray-500">Quantity: {item.quantity}</p>
                <p className="text-gray-700 font-semibold">
                  ${item.product.price}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OrderProductsDialog;
