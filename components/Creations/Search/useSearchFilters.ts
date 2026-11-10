"use client"

import { SortOptions, StatusOptions } from "@/app/api/types"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

export interface SearchFilters {
    search: string
    sort: SortOptions
    status: number
    includeTags: string[]
    excludeTags: string[]
}

/**
 * Values the server rendered the page with. Used when the URL doesn't specify a filter
 * (e.g. the /content/[type]/[criteria] pages, which pass their own defaults).
 */
export interface SearchFilterDefaults {
    search?: string
    sort?: SortOptions | string
    status?: number | string
    includeTags?: string
    excludeTags?: string
}

const splitTags = (value?: string | null) => (value ?? "").split(",").filter((tag) => tag.length > 0)

function parseFilters(params: URLSearchParams, defaults: SearchFilterDefaults): SearchFilters {
    const statusParam = params.get("status") ?? (defaults.status !== undefined ? String(defaults.status) : null)
    const status = statusParam !== null ? Number.parseInt(statusParam) : NaN

    return {
        search: params.get("search") ?? defaults.search ?? "",
        sort: (params.get("sort") || defaults.sort || SortOptions.Newest) as SortOptions,
        status: Number.isNaN(status) ? StatusOptions.Approved : status,
        includeTags: params.has("includeTags") ? splitTags(params.get("includeTags")) : splitTags(defaults.includeTags),
        excludeTags: params.has("excludeTags") ? splitTags(params.get("excludeTags")) : splitTags(defaults.excludeTags),
    }
}

/**
 * Shared search/filter state for the listing pages.
 *
 * The URL is the single source of truth, so the search bar and the sidebar always agree and shared
 * links keep their filters. Changes are applied to local state immediately (so the UI responds while
 * the server re-renders) and then written to the URL. Nothing is pushed on mount, and any change
 * resets pagination to the first page.
 */
export function useSearchFilters(defaults: SearchFilterDefaults = {}) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const paramsKey = searchParams.toString()

    const fromUrl = useMemo(
        () => parseFilters(new URLSearchParams(paramsKey), defaults),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [paramsKey, defaults.search, defaults.sort, defaults.status, defaults.includeTags, defaults.excludeTags]
    )

    const [filters, setLocalFilters] = useState<SearchFilters>(fromUrl)
    const filtersRef = useRef(filters)

    // Follow the URL when it changes from outside (back/forward, links, or our own navigation landing)
    useEffect(() => {
        filtersRef.current = fromUrl
        setLocalFilters(fromUrl)
    }, [fromUrl])

    const setFilters = useCallback((changes: Partial<SearchFilters>, mode: "push" | "replace" = "push") => {
        const next = { ...filtersRef.current, ...changes }
        filtersRef.current = next
        setLocalFilters(next)

        const params = new URLSearchParams(paramsKey)
        const setOrDelete = (key: string, value: string) => value.length > 0 ? params.set(key, value) : params.delete(key)
        setOrDelete("search", next.search)
        setOrDelete("sort", next.sort)
        setOrDelete("status", String(next.status))
        setOrDelete("includeTags", next.includeTags.join(","))
        setOrDelete("excludeTags", next.excludeTags.join(","))
        // The result set changed, so the current page number no longer means anything
        params.delete("page")

        const query = params.toString()
        const url = query ? `${pathname}?${query}` : pathname
        if (mode === "replace") {
            router.replace(url, { scroll: false })
        } else {
            router.push(url, { scroll: false })
        }
    }, [paramsKey, pathname, router])

    /** Cycles a tag through include -> exclude -> not filtered */
    const toggleTag = useCallback((tag: string) => {
        const { includeTags, excludeTags } = filtersRef.current
        if (includeTags.includes(tag)) {
            setFilters({ includeTags: includeTags.filter((t) => t !== tag), excludeTags: [...excludeTags.filter((t) => t !== tag), tag] })
        } else if (excludeTags.includes(tag)) {
            setFilters({ excludeTags: excludeTags.filter((t) => t !== tag) })
        } else {
            setFilters({ includeTags: [...includeTags, tag] })
        }
    }, [setFilters])

    const clearFilters = useCallback(() => {
        setFilters({ search: "", sort: SortOptions.Newest, status: StatusOptions.Approved, includeTags: [], excludeTags: [] })
    }, [setFilters])

    return { filters, setFilters, toggleTag, clearFilters }
}

/** Translation key suffix for a status value */
export function statusLabelKey(status: number) {
    if (status === StatusOptions.Featured) return "featured"
    if (status === StatusOptions.Approved) return "approved"
    return "unapproved"
}
