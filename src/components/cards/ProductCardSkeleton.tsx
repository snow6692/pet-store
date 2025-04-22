import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function ProductCardSkeleton() {
  return (
    <Card className="border-none shadow-md bg-background/95 backdrop-blur-sm">
      {/* Image Section */}
      <div className="relative aspect-[4/3]">
        <Skeleton className="w-full h-full rounded-t-lg" />
        <Skeleton className="absolute top-3 left-3 h-6 w-16 rounded-full" />
        <Skeleton className="absolute top-3 right-3 h-6 w-6 rounded-full" />
      </div>

      {/* Content Section */}
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-4 rounded-full" />
          ))}
          <Skeleton className="h-4 w-8 ml-1" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-5 w-20 rounded-full" />
      </CardContent>

      {/* Footer Section */}
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full rounded-md" />
      </CardFooter>
    </Card>
  );
}

export default ProductCardSkeleton;