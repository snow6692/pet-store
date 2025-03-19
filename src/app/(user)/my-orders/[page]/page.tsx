import { getMyOrders } from "@/actions/order.action";
import MyOrdersPageComponent from "@/components/pages/MyOrdersPageComponent";
import MyOrdersHomePagination from "@/components/pagination/MyOrdersPagination";
import { getMyCachedOrders } from "@/lib/cache/order.cache";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

export default async function MyOrdersPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const page = parseInt((await params).page);
  const limit = 10;
  const data = await getMyOrders({ page, limit });
  if (!data || !data.myOrders || data.myOrders.length === 0) {
    return notFound();
  }

  return (
    <div>
      <MyOrdersPageComponent myOrders={data.myOrders} />
      <div className=" mt-10">
        <Suspense fallback={<p>Loading pagination...</p>}>
          <MyOrdersHomePagination page={page} totalPages={data.pages} />
        </Suspense>
      </div>
    </div>
  );
}
