import clsx from "clsx";

export const getStatusVariant = (status: string) =>
  clsx("px-3 py-1 rounded-full text-white text-sm font-semibold", {
    "bg-yellow-500": status === "PENDING",
    "bg-blue-500": status === "ON_WAY",
    "bg-green-500": status === "DELIVERED",
    "bg-red-500": status === "CANCELED",
  });

export const getPaymentVariant = (paymentMethod: string) =>
  clsx("px-3 py-1 rounded-full text-white text-sm font-semibold", {
    "bg-green-600": paymentMethod === "CASH_ON_DELIVERY",
    "bg-blue-600": paymentMethod === "VISA",
  });
