import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string>;
}

export default function Pagination({ currentPage, totalPages, basePath, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null;

  function pageUrl(page: number) {
    const params = new URLSearchParams(searchParams ?? {});
    params.set("page", String(page));
    return `${basePath}?${params.toString()}`;
  }

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-12" aria-label="Pagination">
      {currentPage > 1 && (
        <Link
          href={pageUrl(currentPage - 1)}
          className="flex items-center justify-center h-10 w-10 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      )}

      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={`ellipsis-${idx}`} className="h-10 w-10 flex items-center justify-center text-gray-400">
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={pageUrl(page)}
            className={`flex items-center justify-center h-10 min-w-10 px-2 rounded-lg text-sm font-medium transition-colors ${
              page === currentPage
                ? "bg-primary text-primary-foreground"
                : "border border-gray-200 hover:bg-gray-100"
            }`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        ),
      )}

      {currentPage < totalPages && (
        <Link
          href={pageUrl(currentPage + 1)}
          className="flex items-center justify-center h-10 w-10 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}
