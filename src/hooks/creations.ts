import useSWR from 'swr'
import { useSessionStorage } from 'usehooks-ts'
import { useToken } from './user'
import { ContentType, Creation, Tags, WithCountResponse } from '@/lib/api'
import { buildQueryString, fetcher } from '@/lib/utils'
import { getCreation, QueryOptions, searchCreations } from '@/lib/fetchers'

export const useCreations = (queryOptions: QueryOptions) => {
    const {token} = useToken()
    const [tempKey] = useSessionStorage('temp_key', '', {serializer: (value) => value, deserializer: (value) => value})

    let key = (token?.length ?? 0) > 0 ? token : tempKey

    const { data, error, isLoading } = useSWR<WithCountResponse<Creation>>(
        [key, queryOptions, 'useCreations'], 
        ([key, queryOptions]) => searchCreations(key, queryOptions as QueryOptions),
        {
            revalidateOnFocus: false,
            dedupingInterval: 1000 * 60 * 5
        }
    )
    if (data?.error) {
        return {
            creations: [],
            count: 0,
            isLoading,
            error: data.error
        }
    }
    return {
        creations: data?.documents ?? [],
        count: data?.totalCount ?? 0,
        isLoading,
        error
    }
}

export const useCreation = (slug: string, type: ContentType) => {
    const {token} = useToken()
    const [tempKey] = useSessionStorage('temp_key', '', {serializer: (value) => value, deserializer: (value) => value})

    let key = (token?.length ?? 0) > 0 ? token : tempKey

    const { data, error, isLoading } = useSWR<Creation | {error: string}>(
        [key, slug, type, 'useCreation'], 
        ([key, slug, type]) => getCreation(key, slug as string, type as ContentType),
        {
            revalidateOnFocus: false,
            dedupingInterval: 1000 * 60 * 5
        }
    )
    if (data && 'error' in data) {
        return {
            creation: null,
            isLoading,
            error: data.error
        }
    }

    return {
        creation: data,
        isLoading,
        error
    }
}

export const useTags = (type: ContentType) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/tags/${type}`
    const { data, error, isLoading } = useSWR<Tags | {error: string}>(
        [url, 'useTags'], 
        ([url]) => fetcher(url, 'GET', null, {}),
        {
            revalidateOnFocus: false,
            dedupingInterval: 1000 * 60 * 60
        }
    )
    return {
        tags: data,
        isLoading,
        error
    }
}

export const useFeed = (limit: number, page: number) => {
    const {token} = useToken()
    const { data, error, isLoading } = useSWR<WithCountResponse<Creation>>(
        [token, 'useFeed', limit, page], 
        async ([token, id, limit, page]) => fetcher(`${process.env.NEXT_PUBLIC_API_URL}/feed`, 'GET', {limit, page}, { 'Authorization': `${token}`}),
        {
            revalidateOnFocus: false,
            dedupingInterval: 1000 * 60 * 5
        }
    )
    if (data?.error) {
        return {
            feed: [],
            count: 0,
            isLoading,
            error: data.error
        }
    }
    return {
        feed: data?.documents ?? [],
        count: data?.totalCount ?? 0,
        isLoading,
        error
    }
}