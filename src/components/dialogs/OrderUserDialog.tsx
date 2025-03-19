"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Order } from "@prisma/client";

interface IProps {
  order: Order;
}

const OrderUserDialog = ({ order }: IProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Badge className="cursor-pointer px-3 py-1 text-sm">
          Show Order Details
        </Badge>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            User Details
          </DialogTitle>
        </DialogHeader>
        <Card>
          <CardContent className="space-y-3 p-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Name</p>
              <p className="text-muted-foreground">{order.name}</p>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm font-medium">Email</p>
              <p className="text-muted-foreground">{order.email}</p>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm font-medium">Phone</p>
              <p className="text-muted-foreground">{order.phone}</p>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm font-medium">Address</p>
              <p className="text-muted-foreground">{order.address}</p>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-medium">City</p>
                <p className="text-muted-foreground">{order.city}</p>
              </div>
              <div>
                <p className="text-sm font-medium">State</p>
                <p className="text-muted-foreground">{order.state}</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-medium">Country</p>
                <p className="text-muted-foreground">{order.country}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Postal Code</p>
                <p className="text-muted-foreground">{order.postalCode}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default OrderUserDialog;
