"use client";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams, usePathname } from "next/navigation";

const WINDOW = 7

// Get pages based on the current page and the total number of pages
export function pageWindow(page: number, pages: number) {
    const count = Math.min(WINDOW, pages)
    const start = Math.min(Math.max(page - Math.floor(WINDOW / 2), 0), Math.max(pages - count, 0))
    return Array.from({ length: count }, (_, i) => start + i)
}

export default function PageNavigator({
    page,
    pages,
    className
}: {
    page: number;
    pages: number;
    className?: string;
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();

    if (!Number.isFinite(pages) || pages <= 1) return null

    const goToPage = (target: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", target.toString());
        return pathname + "?" + params.toString();
    };

    return (
        <Pagination className={className}>
            <PaginationContent>
                {page > 0 && (
                    <PaginationItem>
                        <PaginationPrevious href={goToPage(page - 1)} />
                    </PaginationItem>
                )}
                {pageWindow(page, pages).map((target) => (
                    <PaginationItem key={target}>
                        <PaginationLink href={goToPage(target)} isActive={target === page}>
                            <span>{target + 1}</span>
                        </PaginationLink>
                    </PaginationItem>
                ))}
                {page < pages - 1 && (
                    <PaginationItem>
                        <PaginationNext href={goToPage(page + 1)} />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}
