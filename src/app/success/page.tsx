"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { placeOrder } from "@/actions/order.action";
import toast from "react-hot-toast";
import { cachedUser } from "@/lib/cache/user.cache";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;

    const processOrder = async () => {
      try {
        const user = await cachedUser();

        const orderData = {
          payment: searchParams.get("payment") || "VISA",
          address: searchParams.get("address") || user?.address || "",
          name: searchParams.get("name") || user?.name || "",
          email: searchParams.get("email") || user?.email || "",
          phone: searchParams.get("phone") || user?.phone || "",
          postalCode: searchParams.get("postalCode") || user?.postalCode || "",
          city: searchParams.get("city") || user?.city || "",
          state: searchParams.get("state") || user?.state || "",
          country: searchParams.get("country") || user?.country || "",
        };

        if (!orderData.payment || !orderData.address) {
          toast.error("Order data is incomplete.");
          router.push("/cart");
          return;
        }

        const result = await placeOrder(orderData);

        if (result.success) {
          toast.success("Order Placed!");
          router.push("/my-orders/1");
        } else {
          toast.error(result.error!);
        }
      } catch (error) {
        console.error("Error processing order:", error);
        toast.error("Something went wrong. Please try again.");
      }
    };

    processOrder();
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Payment Successful!</h1>
      <p>We are processing your order...</p>
    </div>
  );
}
