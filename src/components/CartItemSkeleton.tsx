import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

function CartItemSkeleton() {
  return (
    <Card className="flex items-center gap-4 p-4 border-none shadow-sm bg-background/95 backdrop-blur-sm">
      {/* Image */}
      <Skeleton className="h-20 w-20 rounded-md" />

      {/* Content */}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </Card>
  );
}

export default CartItemSkeleton;
