import useSWR from "swr"
import { fetchComment, fetchComments } from "../community"
import { CollectionNames, IComment, SortOptions } from "../types"

const commentsFetcher = (id: string) => {
    return fetchComment(id)
}

export const useComment = (id: string) => {
    const {data, error, isLoading} = useSWR(['comment', id], ([key, id]) => commentsFetcher(id))
    return {
        comment: data as IComment | undefined,
        isLoading,
        error
    }
}

export const useComments = (slug: string, contentType: CollectionNames, sort: SortOptions, limit: number) => {
    const {data, error, isLoading} = useSWR(['comments', slug, contentType, sort, limit], ([key, slug, contentType, sort, limit]) => fetchComments(slug, {contentType, sort, limit}))
    return {
        comments: data?.documents as IComment[] | undefined,
        isLoading,
        error
    }
}
