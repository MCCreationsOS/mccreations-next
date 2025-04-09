"use client";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

export default function PageNavigator({
    page,
    pages,
}: {
    page: number;
    pages: number;
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const createQueryString = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set(name, value);

        return params.toString();
    };

    const goToPage = (page: number) => {
        return pathname + "?" + createQueryString("page", page.toString());
    };

    return (
        <Pagination>
            <PaginationContent>
                {page != 0 ? (
                    <PaginationItem>
                        <PaginationPrevious href={goToPage(page - 1)} />
                    </PaginationItem>
                ) : undefined}
                {page - 3 >= 0 ? (
                    page < pages - 4 ? (
                        <PaginationItem>
                            <PaginationLink href={goToPage(page - 3)}>
                                <span>{page - 2}</span>
                            </PaginationLink>
                        </PaginationItem>
                    ) : (
                        <PaginationItem>
                            <PaginationLink
                                className={page == pages - 7 ? "current" : ""}
                                href={goToPage(pages - 7)}
                            >
                                <span>{pages - 6}</span>
                            </PaginationLink>
                        </PaginationItem>
                    )
                ) : (
                    <PaginationItem>
                        <PaginationLink
                            className={page == 0 ? "current" : ""}
                            href={goToPage(0)}
                        >
                            <span>{1}</span>
                        </PaginationLink>
                    </PaginationItem>
                )}
                {pages > 1 ? (
                    page - 3 >= 0 ? (
                        page < pages - 4 ? (
                            <PaginationItem>
                                <PaginationLink href={goToPage(page - 2)}>
                                    <span>{page - 1}</span>
                                </PaginationLink>
                            </PaginationItem>
                        ) : (
                            <PaginationItem>
                                <PaginationLink
                                    className={
                                        page == pages - 6 ? "current" : ""
                                    }
                                    href={goToPage(pages - 6)}
                                >
                                    <span>{pages - 5}</span>
                                </PaginationLink>
                            </PaginationItem>
                        )
                    ) : (
                        <PaginationItem>
                            <PaginationLink
                                className={page == 1 ? "current" : ""}
                                href={goToPage(1)}
                            >
                                <span>{2}</span>
                            </PaginationLink>
                        </PaginationItem>
                    )
                ) : undefined}
                {pages > 2 ? (
                    page - 3 >= 0 ? (
                        page < pages - 4 ? (
                            <PaginationItem>
                                <PaginationLink href={goToPage(page - 1)}>
                                    <span>{page}</span>
                                </PaginationLink>
                            </PaginationItem>
                        ) : (
                            <PaginationItem>
                                <PaginationLink
                                    className={
                                        page == pages - 5 ? "current" : ""
                                    }
                                    href={goToPage(pages - 5)}
                                >
                                    <span>{pages - 4}</span>
                                </PaginationLink>
                            </PaginationItem>
                        )
                    ) : (
                        <PaginationItem>
                            <PaginationLink
                                className={page == 2 ? "current" : ""}
                                href={goToPage(2)}
                            >
                                <span>{3}</span>
                            </PaginationLink>
                        </PaginationItem>
                    )
                ) : undefined}
                {pages > 3 ? (
                    page - 3 >= 0 ? (
                        page < pages - 4 ? (
                            <PaginationItem>
                                <PaginationLink
                                    className="current"
                                    href={goToPage(page)}
                                >
                                    <span>{page + 1}</span>
                                </PaginationLink>
                            </PaginationItem>
                        ) : (
                            <PaginationItem>
                                <PaginationLink
                                    className={
                                        page == pages - 4 ? "current" : ""
                                    }
                                    href={goToPage(pages - 4)}
                                >
                                    <span>{pages - 3}</span>
                                </PaginationLink>
                            </PaginationItem>
                        )
                    ) : (
                        <PaginationItem>
                            <PaginationLink
                                className={page == 3 ? "current" : ""}
                                href={goToPage(3)}
                            >
                                <span>{4}</span>
                            </PaginationLink>
                        </PaginationItem>
                    )
                ) : undefined}
                {pages > 4 ? (
                    page - 3 >= 0 ? (
                        page < pages - 4 ? (
                            <PaginationItem>
                                <PaginationLink href={goToPage(page + 1)}>
                                    <span>{page + 2}</span>
                                </PaginationLink>
                            </PaginationItem>
                        ) : (
                            <PaginationItem>
                                <PaginationLink
                                    className={
                                        page == pages - 3 ? "current" : ""
                                    }
                                    href={goToPage(pages - 3)}
                                >
                                    <span>{pages - 2}</span>
                                </PaginationLink>
                            </PaginationItem>
                        )
                    ) : (
                        <PaginationItem>
                            <PaginationLink
                                className={page == 4 ? "current" : ""}
                                href={goToPage(4)}
                            >
                                <span>{5}</span>
                            </PaginationLink>
                        </PaginationItem>
                    )
                ) : undefined}
                {pages > 5 ? (
                    page - 3 >= 0 ? (
                        page < pages - 4 ? (
                            <PaginationItem>
                                <PaginationLink href={goToPage(page + 2)}>
                                    <span>{page + 3}</span>
                                </PaginationLink>
                            </PaginationItem>
                        ) : (
                            <PaginationItem>
                                <PaginationLink
                                    className={
                                        page == pages - 2 ? "current" : ""
                                    }
                                    href={goToPage(pages - 2)}
                                >
                                    <span>{pages - 1}</span>
                                </PaginationLink>
                            </PaginationItem>
                        )
                    ) : (
                        <PaginationItem>
                            <PaginationLink
                                className={page == 5 ? "current" : ""}
                                href={goToPage(5)}
                            >
                                <span>{6}</span>
                            </PaginationLink>
                        </PaginationItem>
                    )
                ) : undefined}
                {pages > 6 ? (
                    page - 3 >= 0 ? (
                        page < pages - 4 ? (
                            <PaginationItem>
                                <PaginationLink href={goToPage(page + 3)}>
                                    <span>{page + 4}</span>
                                </PaginationLink>
                            </PaginationItem>
                        ) : (
                            <PaginationItem>
                                <PaginationLink
                                    className={
                                        page == pages - 1 ? "current" : ""
                                    }
                                    href={goToPage(pages - 1)}
                                >
                                    <span>{pages}</span>
                                </PaginationLink>
                            </PaginationItem>
                        )
                    ) : (
                        <PaginationItem>
                            <PaginationLink
                                className={page == 6 ? "current" : ""}
                                href={goToPage(6)}
                            >
                                <span>{7}</span>
                            </PaginationLink>
                        </PaginationItem>
                    )
                ) : undefined}
                {pages > 1 ? (
                    page != pages - 1 ? (
                        <PaginationItem>
                            <PaginationNext href={goToPage(page + 1)}>
                            </PaginationNext>
                        </PaginationItem>
                    ) : undefined
                ) : undefined}
            </PaginationContent>
        </Pagination>
    );
}
