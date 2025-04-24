import { getMyOrders } from "@/actions/order.action";
import OrdersPagination from "@/components/pagination/OrdersPagination";
import OrdersTable from "@/components/tables/OrdersTable";
import React, { Suspense } from "react";

export default async function OrdersAdminPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const page = parseInt((await params).page);
  const limit = 10;
  const data = await getMyOrders({ page, limit, isAdmin: true });

  if (!data || !data.myOrders || data.myOrders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold">No Orders Found</h1>
        <p className="text-gray-400">
          There are no orders available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div>
      <OrdersTable orders={data.myOrders} />
      <div className="mt-10">
        <Suspense fallback={<p>Loading pagination...</p>}>
          <OrdersPagination page={page} totalPages={data.pages} />
        </Suspense>
      </div>
    </div>
  );
}
