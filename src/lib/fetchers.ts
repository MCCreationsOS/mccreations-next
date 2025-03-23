import { buildQueryString, fetcher } from "./utils"
import { WithCountResponse, Creation, ContentType } from "./api"

interface QueryOptionsBase {
    slug?: string,
    sort?: string,
    status?: number,
    exclusiveStatus?: boolean,
    version?: string,
    search?: string,
    includeTags?: string[],
    excludeTags?: string[],
    creators?: string[],
    contentType?: "maps" | "datapacks" | "resourcepacks" | "marketplace" | "all" | "content",
    limit?: number,
}

interface PaginationOptions {
    page: number,
    offset: number
}

export type QueryOptions = QueryOptionsBase | (PaginationOptions & QueryOptionsBase)


export async function searchCreations (token: string, queryOptions: QueryOptions): Promise<WithCountResponse<Creation>> {
    const queryString = buildQueryString(queryOptions)
    const url = `${process.env.NEXT_PUBLIC_API_URL}/creations${queryString}`
    const response = await fetcher(url, 'GET', null, {
        'Authorization': `${token}`
    })
    return response
}

export async function getCreation (token: string, slug: string, type: ContentType): Promise<Creation> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/creations/${type}s/${slug}`
    const response = await fetcher(url, 'GET', null, {
        'Authorization': `${token}`
    })
    return response
}