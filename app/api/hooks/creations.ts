import useSWR, { mutate } from 'swr'
import { fetchDatapack, fetchMap, fetchResourcepack, fetchTags, getFeed, searchContent } from '../content'
import { CollectionNames, ContentTypes, IContentDoc, QueryOptions, Tags } from '../types'
import { useLocalStorage, useSessionStorage } from 'usehooks-ts'
import { useToken } from './users'
// import { fetcher } from '../utils'

const searchCreationsFetcher = (token: string, queryOptions: QueryOptions, filterQuery?: QueryOptions) => {
    return searchContent(queryOptions, false, filterQuery, token)
}

const getCreationFetcher = (token: string, slug: string, type: ContentTypes) => {
    switch(type) {
        case ContentTypes.Maps: return fetchMap(slug, token)
        case ContentTypes.Datapacks: return fetchDatapack(slug, token)
        case ContentTypes.Resourcepacks: return fetchResourcepack(slug, token)
    }
}

export const useCreationSearch = (queryOptions: QueryOptions, filterQuery?: QueryOptions) => {
    const {token} = useToken()
    const [tempKey] = useSessionStorage('temp_key', '', {serializer: (value) => value, deserializer: (value) => value})

    let key = (token?.length ?? 0) > 0 ? token : tempKey

    const { data, error, isLoading } = useSWR([key, queryOptions, filterQuery], ([key, queryOptions, filterQuery]) => searchCreationsFetcher(key, queryOptions, filterQuery))
    return {
        creations: (data?.documents ?? []) as IContentDoc[],
        count: data?.count ?? 0,
        isLoading,
        error
    }
}

export const useCreations = (queryOptions: QueryOptions) => {
    const {token} = useToken()
    const [tempKey] = useSessionStorage('temp_key', '', {serializer: (value) => value, deserializer: (value) => value})

    let key = (token?.length ?? 0) > 0 ? token : tempKey

    const { data, error, isLoading } = useSWR([key, queryOptions, 'useCreations'], ([key, queryOptions]) => searchCreationsFetcher(key, queryOptions))
    return {
        creations: (data?.documents ?? []) as IContentDoc[],
        count: data?.totalCount ?? 0,
        isLoading,
        error
    }
}

export const useCreation = (slug: string, type: ContentTypes) => {
    const {token} = useToken()
    const [tempKey] = useSessionStorage('temp_key', '', {serializer: (value) => value, deserializer: (value) => value})

    let key = (token?.length ?? 0) > 0 ? token : tempKey

    const { data, error, isLoading } = useSWR([key, slug, type, 'useCreation'], ([key, slug, type]) => getCreationFetcher(key, slug, type))

    return {
        creation: data as IContentDoc | {error: string},
        isLoading,
        error
    }
}

export const useTags = (type: ContentTypes) => {
    const { data, error, isLoading } = useSWR([type, 'useTags'], ([type]) => fetchTags(type))
    return {
        tags: data as Tags | {error: string},
        isLoading,
        error
    }
}

export const useFeed = (limit: number, page: number) => {
    const {token} = useToken()
    const { data, error, isLoading } = useSWR([token, 'useFeed', limit, page], async ([token, id, limit, page]) => getFeed(token, limit, page))
    return {
        feed: data?.documents as IContentDoc[] | {error: string} | undefined,
        count: data?.totalCount ?? 0,
        isLoading,
        error
    }
}