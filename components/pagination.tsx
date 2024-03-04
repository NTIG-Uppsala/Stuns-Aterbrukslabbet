"use client";

import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactElement } from "react";

interface PaginationProps {
  pages: number;
}

export default function Pagination({ pages }: PaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const currentPage = Number(searchParams.get("page")) || 1;

  function handlePageChange(pageIndex: number) {
    const params = new URLSearchParams(searchParams);
    if (pageIndex > pages) {
      params.set("page", pages.toString());
    } else if (pageIndex > 1) {
      params.set("page", pageIndex.toString());
    } else {
      params.delete("page");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  const pageButtons: Array<ReactElement> = [];

  function generatePageButtons(startPage: number, endPage: number) {
    for (let pageIndex = startPage; pageIndex <= endPage; pageIndex++) {
      if (pageIndex === currentPage) {
        pageButtons.push(
          <button
            key={pageIndex}
            className="underline font-semibold"
            onClick={() => handlePageChange(pageIndex)}
          >
            {pageIndex}
          </button>
        );
      } else {
        pageButtons.push(
          <button key={pageIndex} onClick={() => handlePageChange(pageIndex)}>
            {pageIndex}
          </button>
        );
      }
    }
  }

  if (pages > 5) {
    if (currentPage > 2 && currentPage < pages - 2) {
      generatePageButtons(currentPage - 2, currentPage + 2);
    } else if (currentPage <= 2) {
      generatePageButtons(1, 5);
    } else if (currentPage >= pages - 2) {
      generatePageButtons(pages - 4, pages);
    }
  } else {
    generatePageButtons(1, pages);
  }

  if (pages <= 1) {
    return;
  } else {
    return (
      <div className="flex justify-center items-center pt-4 gap-x-4">
        <div className="flex items-center">
          {pages > 6 && (
            <button onClick={() => handlePageChange(1)}>
              <ChevronFirst className="h-6 w-6" />
            </button>
          )}
          <button onClick={() => handlePageChange(currentPage - 1)}>
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>
        <div className="flex justify-center gap-x-4 text-xl">{pageButtons}</div>
        <div className="flex items-center">
          <button onClick={() => handlePageChange(currentPage + 1)}>
            <ChevronRight className="h-6 w-6" />
          </button>
          {pages > 6 && (
            <button onClick={() => handlePageChange(pages)}>
              <ChevronLast className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
    );
  }
}