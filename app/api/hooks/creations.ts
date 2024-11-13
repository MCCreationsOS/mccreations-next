import useSWR, { mutate } from 'swr'
import { fetchDatapack, fetchMap, fetchResourcepack, fetchTags, getContent, getFeed, searchContent } from '../content'
import { CollectionNames, ContentTypes, IContentDoc, QueryOptions, Tags } from '../types'
import { useLocalStorage } from 'usehooks-ts'
import { useToken } from './users'
// import { fetcher } from '../utils'

const searchCreationsFetcher = (token: string, queryOptions: QueryOptions, filterQuery?: QueryOptions) => {
    return searchContent(queryOptions, false, filterQuery, token)
}

const getCreationsFetcher = (token: string, queryOptions: QueryOptions) => {
    return getContent(queryOptions,token)
}

const getCreationFetcher = (token: string, slug: string, type: ContentTypes) => {
    switch(type) {
        case ContentTypes.Maps: return fetchMap(slug, token)
        case ContentTypes.Datapacks: return fetchDatapack(slug, token)
        case ContentTypes.Resourcepacks: return fetchResourcepack(slug, token)
    }
}

export const useCreationSearch = (queryOptions: QueryOptions, filterQuery?: QueryOptions) => {
    const [token] = useLocalStorage('jwt', '', {serializer: (value) => value, deserializer: (value) => value})
    const [tempKey] = useLocalStorage('temp_key', '', {serializer: (value) => value, deserializer: (value) => value})

    const { data, error, isLoading } = useSWR([token ?? tempKey, queryOptions, filterQuery], ([token, queryOptions, filterQuery]) => searchCreationsFetcher(token, queryOptions, filterQuery))
    return {
        creations: (data?.documents ?? []) as IContentDoc[],
        count: data?.count ?? 0,
        isLoading,
        error
    }
}

export const useCreations = (queryOptions: QueryOptions) => {
    const [token] = useLocalStorage('jwt', '', {serializer: (value) => value, deserializer: (value) => value})
    const [tempKey] = useLocalStorage('temp_key', '', {serializer: (value) => value, deserializer: (value) => value})

    const { data, error, isLoading } = useSWR([token ?? tempKey, queryOptions, 'useCreations'], ([token, queryOptions]) => getCreationsFetcher(token, queryOptions))
    return {
        creations: (data?.documents ?? []) as IContentDoc[],
        isLoading,
        error
    }
}

export const useCreation = (slug: string, type: ContentTypes) => {
    const [token] = useLocalStorage('jwt', '', {serializer: (value) => value, deserializer: (value) => value})
    const [tempKey] = useLocalStorage('temp_key', '', {serializer: (value) => value, deserializer: (value) => value})

    const { data, error, isLoading } = useSWR([token ?? tempKey, slug, type, 'useCreation'], ([token, slug, type]) => getCreationFetcher(token, slug, type))

    return {
        creation: data as IContentDoc | {error: string},
        isLoading,
        error
    }
}

export const useTags = (type: CollectionNames) => {
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
        feed: data?.feed as IContentDoc[] | {error: string} | undefined,
        count: data?.totalCount ?? 0,
        isLoading,
        error
    }
}