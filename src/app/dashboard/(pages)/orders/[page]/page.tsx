import { getAllOrders } from "@/actions/order.action";
import MyOrdersPageComponent from "@/components/pages/MyOrdersPageComponent";
import OrdersPagination from "@/components/pagination/OrdersPagination";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

export default async function OrdersAdminPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const page = parseInt((await params).page);
  const limit = 10;
  const data = await getAllOrders({ page, limit });
  if (!data || !data.myOrders || data.myOrders.length === 0) {
    return notFound();
  }

  return (
    <div>
      <MyOrdersPageComponent myOrders={data.myOrders} />
      <div className=" mt-10">
        <Suspense fallback={<p>Loading pagination...</p>}>
          <OrdersPagination page={page} totalPages={data.pages} />
        </Suspense>
      </div>
    </div>
  );
}
