import WishlistComponent from "@/components/pages/WishlistComponent";
import { Loader } from "lucide-react";
import React, { Suspense } from "react";

function WishlistPage() {
  return (
    <Suspense fallback={<Loader />}>
      <WishlistComponent />
    </Suspense>
  );
}

export default WishlistPage;
