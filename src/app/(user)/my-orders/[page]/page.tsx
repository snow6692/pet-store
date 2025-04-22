// import { getMyOrders } from "@/actions/order.action";
// import MyOrdersPageComponent from "@/components/pages/MyOrdersPageComponent";
// import MyOrdersHomePagination from "@/components/pagination/MyOrdersHomePagination";
// import { notFound } from "next/navigation";
// import React, { Suspense } from "react";

// export default async function MyOrdersPage({
//   params,
// }: {
//   params: Promise<{ page: string }>;
// }) {
//   const page = parseInt((await params).page);
//   const limit = 10;
//   const data = await getMyOrders({ page, limit });
//   if (!data || !data.myOrders || data.myOrders.length === 0) {
//     return notFound();
//   }

//   return (
//     <div>
//       <MyOrdersPageComponent myOrders={data.myOrders} />
//       <div className=" mt-10">
//         <Suspense fallback={<p>Loading pagination...</p>}>
//           <MyOrdersHomePagination page={page} totalPages={data.pages} />
//         </Suspense>
//       </div>
//     </div>
//   );
// }

import { getMyOrders } from "@/actions/order.action";
import MyOrdersPageComponent from "@/components/pages/MyOrdersPageComponent";
import MyOrdersHomePagination from "@/components/pagination/MyOrdersHomePagination";
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<MyOrdersSkeleton />}>
          <MyOrdersPageComponent myOrders={data.myOrders} />
        </Suspense>
        <div className="mt-10 flex justify-center">
          <Suspense fallback={<p>Loading pagination...</p>}>
            <MyOrdersHomePagination page={page} totalPages={data.pages} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function MyOrdersSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="border-none shadow-xl bg-background/95 backdrop-blur-sm rounded-lg p-6 animate-pulse"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 w-24 bg-muted/50 rounded" />
            <div className="h-6 w-32 bg-muted/50 rounded" />
          </div>
          <div className="flex justify-between mb-4">
            <div className="h-4 w-40 bg-muted/50 rounded" />
            <div className="h-4 w-32 bg-muted/50 rounded" />
          </div>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-16 w-16 bg-muted/50 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-muted/50 rounded" />
                  <div className="h-4 w-24 bg-muted/50 rounded" />
                  <div className="h-4 w-16 bg-muted/50 rounded" />
                </div>
              </div>
            ))}
          </div>
          <div className="h-6 w-32 bg-muted/50 rounded mt-4" />
        </div>
      ))}
    </div>
  );
}
