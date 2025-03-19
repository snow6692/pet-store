"use client";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function OrdersPagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    router.push(`/dashboard/orders/${newPage}`);
  };

  return (
    <Pagination>
      <PaginationContent>
        {/*  Previous */}
        <PaginationItem>
          <PaginationPrevious
            href={`/dashboard/orders/${page - 1}`}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(page - 1);
            }}
            className={page === 1 ? "opacity-50 pointer-events-none" : ""}
          />
        </PaginationItem>

        {/* page numbers */}
        {[...Array(totalPages)].map((_, i) => {
          const pageNumber = i + 1;
          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href={`/dashboard/orders/${pageNumber}`}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(pageNumber);
                }}
                isActive={pageNumber === page}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* more than 5 pages   */}
        {totalPages > 5 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/*  Next */}
        <PaginationItem>
          <PaginationNext
            href={`/dashboard/orders/${page + 1}`}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(page + 1);
            }}
            className={
              page === totalPages ? "opacity-50 pointer-events-none" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
