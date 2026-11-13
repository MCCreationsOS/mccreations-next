import useSWR from "swr"
import useSWRInfinite from "swr/infinite"
import { fetchComment, fetchComments } from "../community"
import { CollectionNames, IComment, SortOptions } from "../types"

const PAGE_SIZE = 20

const commentsFetcher = (id: string) => {
    return fetchComment(id)
}

export const useComment = (id: string) => {
    const { data, error, isLoading } = useSWR(['comment', id], ([key, id]) => commentsFetcher(id))
    const valid = data && typeof data === "object" && !("error" in data) && data._id
    return {
        comment: valid ? data as IComment : undefined,
        notFound: !isLoading && !valid,
        isLoading,
        error
    }
}

type CommentPage = { documents?: IComment[], totalCount?: number } | undefined

export const useComments = (slug: string, contentType: CollectionNames, sort: SortOptions) => {
    const { data, error, isLoading, isValidating, size, setSize, mutate } = useSWRInfinite<CommentPage>(
        (index) => ['comments', slug, contentType, sort, index],
        ([, slug, contentType, sort, index]) => fetchComments(slug as string, { contentType: contentType as string, sort: sort as SortOptions, limit: PAGE_SIZE, page: index as number })
    )

    const seen = new Set<string | undefined>()
    const comments = data?.flatMap((page) => page?.documents ?? []).filter((c) => !seen.has(c._id) && !!seen.add(c._id))
    const totalCount = data?.[0]?.totalCount ?? 0
    const lastPage = data?.[data.length - 1]
    const hasMore = !!lastPage && (lastPage.documents?.length ?? 0) === PAGE_SIZE && (comments?.length ?? 0) < totalCount

    return {
        comments,
        totalCount,
        hasMore,
        isLoadingMore: isValidating && !!data && size > data.length,
        loadMore: () => setSize(size + 1),
        setComments: (updated: IComment[]) => {
            mutate((pages) => {
                if (!pages || pages.length === 0) return [{ documents: updated, totalCount: updated.length }]
                const byId = new Map(updated.map((c) => [c._id, c]))
                const known = new Set(pages.flatMap((page) => page?.documents?.map((c) => c._id) ?? []))
                const added = updated.filter((c) => !known.has(c._id))
                const removed = pages.flatMap((page) => page?.documents ?? []).filter((c) => !byId.has(c._id)).length
                const next = pages.map((page) => ({
                    ...page,
                    documents: (page?.documents ?? []).filter((c) => byId.has(c._id)).map((c) => byId.get(c._id)!)
                }))
                // New comments go where the current sort would put them
                const target = sort === SortOptions.Oldest ? next.length - 1 : 0
                next[target].documents = sort === SortOptions.Oldest ? [...next[target].documents, ...added] : [...added, ...next[target].documents]
                next[0].totalCount = Math.max(0, (pages[0]?.totalCount ?? 0) + added.length - removed)
                return next
            }, { revalidate: false })
        },
        isLoading,
        error
    }
}

export const useAllComments = (page: number) => {
    const { data, error, isLoading } = useSWR(['comments', page], () => fetchComments("", { page: page }))
    return {
        comments: data?.documents as IComment[] | undefined,
        total: data?.totalCount,
        isLoading,
        error
    }
}
