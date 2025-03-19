import Image from "next/image";
import { ordersType } from "@/lib/types/order.types";
import { getPaymentVariant, getStatusVariant } from "@/lib/variants";

export default function MyOrdersPageComponent({
  myOrders,
}: {
  myOrders: ordersType;
}) {
  if (!myOrders) return <p>No orders found!</p>;
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {myOrders?.length === 0 ? (
        <p className="text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {myOrders.map((order) => {
            const totalPrice = order.items.reduce(
              (acc, item) => acc + item.product.price * item.quantity,
              0
            );

            return (
              <div
                key={order.id}
                className="border p-4 rounded-lg shadow relative"
              >
                <div className="flex justify-between items-center">
                  <span className={getStatusVariant(order.status)}>
                    {order.status}
                  </span>
                  <span
                    className={getPaymentVariant(order.paymentMethod || "")}
                  >
                    {order.paymentMethod?.replace("_", " ")}
                  </span>
                </div>

                {/* ✅ Order Details */}
                <div className="flex justify-between mt-2">
                  <p className="text-gray-700">
                    <span className="font-semibold">Order ID:</span> {order.id}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="mt-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 border-b pb-2"
                    >
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={50}
                        height={50}
                        className="rounded"
                      />
                      <div>
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-800 font-bold">
                          ${item.product.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-2 font-semibold">Total: ${totalPrice}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
