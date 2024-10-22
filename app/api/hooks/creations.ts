import useSWR from 'swr'
import { fetchDatapack, fetchMap, fetchResourcepack, fetchTags, getContent, searchContent } from '../content'
import { CollectionNames, ContentTypes, IContentDoc, QueryOptions, Tags } from '../types'
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
    let token = localStorage?.getItem('jwt')
    if(!token) {
        token = sessionStorage?.getItem('temp_key') + ""
    }

    const { data, error, isLoading } = useSWR([token, queryOptions, filterQuery], ([token, queryOptions, filterQuery]) => searchCreationsFetcher(token, queryOptions, filterQuery))
    return {
        creations: (data?.documents ?? []) as IContentDoc[],
        count: data?.count ?? 0,
        isLoading,
        error
    }
}

export const useCreations = (queryOptions: QueryOptions) => {
    let token = localStorage?.getItem('jwt')
    if(!token) {
        token = sessionStorage?.getItem('temp_key') + ""
    }

    const { data, error, isLoading } = useSWR([token, queryOptions, 'useCreations'], ([token, queryOptions]) => getCreationsFetcher(token, queryOptions))
    return {
        creations: (data?.documents ?? []) as IContentDoc[],
        isLoading,
        error
    }
}

export const useCreation = (slug: string, type: ContentTypes) => {
    let token = localStorage?.getItem('jwt')
    if(!token) {
        token = sessionStorage?.getItem('temp_key') + ""
    }

    const { data, error, isLoading } = useSWR([token, slug, type, 'useCreation'], ([token, slug, type]) => getCreationFetcher(token, slug, type))
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
