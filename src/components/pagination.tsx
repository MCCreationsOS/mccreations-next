import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "./ui/pagination";

export function AutoPagination({
    totalPages,
    currentPage,
    path,
}: {
    totalPages: number;
    currentPage: number;
    path: string;
}) {
    return (
        <div className="flex justify-center">
            <Pagination>
                <PaginationContent>
                    {currentPage > 1 && (
                        <PaginationItem>
                            <PaginationPrevious
                                href={`${path}?page=${currentPage - 1}`}
                            />
                        </PaginationItem>
                    )}

                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        let pageNumber: number;

                        // Calculate which page numbers to show
                        if (totalPages <= 5) {
                            pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                            pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i;
                        } else {
                            pageNumber = currentPage - 2 + i;
                        }

                        return (
                            <PaginationItem key={pageNumber}>
                                <PaginationLink
                                    href={`${path}?page=${pageNumber}`}
                                    isActive={pageNumber === currentPage}
                                >
                                    {pageNumber}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    })}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}

                    {currentPage < totalPages && (
                        <PaginationItem>
                            <PaginationNext
                                href={`${path}?page=${currentPage + 1}`}
                            />
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>
        </div>
    );
}
