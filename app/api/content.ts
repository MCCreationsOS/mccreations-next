
import { ICreator, IContentDoc, QueryOptions, SortOptions, CollectionNames, ContentTypes } from "./types"
/** 
 * Format query options for a fetch request. This should be run before any request to the API to avoid
 * sending undefined values
 * @param queryOptions The query options to format
 * @returns The formatted queryOptions
*/
export function formatQueryOptions(options: QueryOptions) {
    // Work on a copy: callers (and SWR keys) pass in objects they still use
    const queryOptions: QueryOptions = { ...options }

    // Define a limit if there is none defined
    if(!queryOptions.limit) {
        queryOptions.limit = 0
    }

    // Define a skip amount of there is none defined
    if(!queryOptions.page) {
        queryOptions.page = 0;
    }

    // Error if the skip is set incorrectly
    if(queryOptions.page < 0) {
        console.error("Page cannot be less than 0")
    }

    // Defines status if it is not defined
    if(queryOptions.status === undefined) {
        queryOptions.status = 2
    }

    if(!queryOptions.includeTags) {
        queryOptions.includeTags = ""
    }

    if(!queryOptions.excludeTags){ 
        queryOptions.excludeTags = ""
    }

    // Defines sort if it is not defined
    if(!queryOptions.sort) {
        queryOptions.sort = SortOptions.Newest
    }

    // Defines search if it is not defined
    if(!queryOptions.search) {
        queryOptions.search = ""
    }

    if(!queryOptions.exclusiveStatus) {
        queryOptions.exclusiveStatus = false
    }

    if(!queryOptions.contentType) {
        queryOptions.contentType = CollectionNames.Maps
    }

    if(!queryOptions.creators) {
        queryOptions.creators = []
    }

    return queryOptions
}

/**
 * Build the /creations query string. Everything goes through URLSearchParams so user input
 * (search terms like "R&D", "C#", "A+B") is encoded instead of breaking the request.
 */
function buildCreationsQuery(q: QueryOptions, count: boolean) {
    return new URLSearchParams({
        contentType: String(q.contentType),
        status: String(q.status),
        limit: String(q.limit),
        page: String(q.page),
        sort: String(q.sort),
        search: q.search ?? "",
        sendCount: String(count),
        exclusiveStatus: String(q.exclusiveStatus),
        includeTags: q.includeTags ?? "",
        excludeTags: q.excludeTags ?? "",
        creators: q.creators?.join(",") ?? ""
    }).toString()
}

/**
 * Search for content based on a query
 * @param queryOptions The query options to send to the API
 * @param count Return the count of maps found rather than the actual maps. Used for pagination. For performance reasons
 * when this parameter is set ONLY the count of maps is returned not the actual map objects
 * @returns `documents` An array of map documents
 * @returns `count` The count of maps found by the query
*/
export async function searchContent(queryOptions: QueryOptions, count: boolean, filterQuery?: QueryOptions, token?: string | null): Promise<{documents: IContentDoc[], totalCount: number}> {
    queryOptions = formatQueryOptions(queryOptions);
    try {
        let p1 = fetch(`${process.env.DATA_URL}/creations?${buildCreationsQuery(queryOptions, count)}`, {
            method: 'GET',
            headers: {
                authorization: token + ""
            },
            next: { tags: ["creations"], revalidate: 86400}
        })
        let p2: Promise<Response> | undefined;
        if(filterQuery) {
            filterQuery = formatQueryOptions(filterQuery);
            // console.log(filterQuery)
            p2 = fetch(`${process.env.DATA_URL}/creations?${buildCreationsQuery(filterQuery, count)}`, {
                method: 'GET',
                headers: {
                    authorization: token + ""
                },
                next: { tags: ["creations"], revalidate: 86400}
            })
        }
        let responses = await Promise.all([p1, p2])
        let data = await responses[0].json();
        let filter = await responses[1]?.json();
        if(filter?.documents) {
            data.documents = data.documents.filter((doc: IContentDoc) => {
                return !filter.documents.some((f: IContentDoc) => {
                    return f._id === doc._id
                })
            })
        }
        return data

    } catch(e) {
        console.error("API fetch error! `searchContent` Is it running?: " + e);
        return {
            documents: [],
            totalCount: 0
        }
    }
}

export async function getFeed(token: string | null, limit: number, page: number) {
    try {
        let response = await fetch(`${process.env.DATA_URL}/feed?${new URLSearchParams({ limit: String(limit), page: String(page) })}`, {
            headers: {
                authorization: token + ""
            },
            next: { tags: ["feed"], revalidate: 86400 }
        })
        if(response.status === 401) {
            return {
                error: "Unauthorized"
            }
        }
        let data = await response.json();
        return data
    } catch(e) {
        console.error("API fetch error! `getFeed` Is it running?: " + e);
        return {
            error: e
        }
    }
}

/**
 * Fetch a single map from the API by slug
 * @param slug The slug of the map to fetch
 * @returns A single map document.
 */
export async function fetchMap(slug: string, token?: string) {
    try {
        let response = await fetch(`${process.env.DATA_URL}/creations/maps/${encodeURIComponent(slug)}`, { 
            next: { tags: [slug], revalidate: 86400 },
            headers: {
                authorization: token + ""
            }
        })
        let data = await response.json();
        return data
    } catch (e) {
        console.error("API fetch error! `fetchMap` Is it running?: " + e);
        return {
            error: e,
            query: slug
        }
    }
}

/**
 * Fetch a single datapack from the API by slug
 * @param slug The slug of the datapack to fetch
 * @returns A single datapack document.
 */
export async function fetchDatapack(slug: string, token?: string) {
    try {
        let response = await fetch(`${process.env.DATA_URL}/creations/datapacks/${encodeURIComponent(slug)}`, { 
            next: { tags: [slug], revalidate: 86400 },
            headers: {
                authorization: token + ""
            }
        })
        let data = await response.json();
        return data
    } catch (e: any) {
        console.error("API fetch error! `fetchDatapack` Is it running?: " + e);
        return {
            error: e.toString(),
            query: slug
        }
    }
}

/**
 * Fetch a single resourcepack from the API by slug
 * @param slug The slug of the resourcepack to fetch
 * @returns A single resourcepack document.
 */
export async function fetchResourcepack(slug: string, token?: string) {
    try {
        let response = await fetch(`${process.env.DATA_URL}/creations/resourcepacks/${encodeURIComponent(slug)}`, { 
            next: { tags: [slug], revalidate: 86400 },
            headers: {
                authorization: token + ""
            }
        })
        let data = await response.json();
        return data
    } catch (e) {
        console.error("API fetch error! `fetchResourcepack` Is it running?: " + e);
        return {
            error: e,
            query: slug
        }
    }
}

export async function fetchMarketplaceItem(slug: string, token?: string) {
    try {
        let response = await fetch(`${process.env.DATA_URL}/creations/marketplace/${encodeURIComponent(slug)}`, {
            next: { tags: [slug], revalidate: 86400 },
            headers: {
                authorization: token + ""
            }
        })
        let data = await response.json();
        return data
    } catch (e) {
        console.error("API fetch error! Is it running?: " + e);
        return {
            error: e,
            query: slug
        }
    }
}

export async function fetchTags(type: ContentTypes) {
    try {
        let response = await fetch(`${process.env.DATA_URL}/creations/tags/${type}`, {
            next: { tags: [type], revalidate: 216000 }
        })
        let data = await response.json();
        return data
    } catch (e) {
        console.error("API fetch error! `fetchTags` Is it running?: " + e);
        return {
            error: e
        }
    }
}

export async function downloadCreation(slug: string, collectionName: CollectionNames) {
    try {
        await fetch(`${process.env.DATA_URL}/creations/${collectionName.toLowerCase()}/${encodeURIComponent(slug)}/download`)
        return;
    } catch (e) {
        console.error("API fetch error! `downloadCreation` Is it running?: " + e);
        return {
            error: e,
            query: slug
        }
    }
}

export async function createNewContent(title: string, type: string, summary: string, token?: string | null) {
    if(!token) token = ""
    try {
        let res = await fetch(`${process.env.DATA_URL}/creations/upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                title: title,
                type: type,
                shortDescription: summary
            })
        })
        let b = await res.json();
        return b
    } catch(e) {
        console.error("API fetch error! `createNewContent` Is it running?: " + e)
        return {
            error: e
        }
    }
}

// Consider moving import to a worker thread

export async function importContent(link: string, type: string, token?: string | null) {
    try {
       let response = await fetch(`${process.env.DATA_URL}/creations/import`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token + ""
        },
        body: JSON.stringify({
            url: link,
            type: type
        })
       })
       return response

    } catch(e: any) {
        console.error("API fetch error! `importContent` Is it running?: " + e)
        return {
            error: e.toString()
        }
    }
}

export async function updateContent(map: IContentDoc, token: string | null, type: CollectionNames, dontSendDate?: boolean) {
    try {
        let response = await fetch(`${process.env.DATA_URL}/creations/update`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token + ""
            },
            body: JSON.stringify(map)
        })
        let data = await response.json();
        return data;
    } catch(e) {
        console.error("API fetch error! `updateContent` Is it running?: " + e)
        return {
            error: e
        }
    }
}

export const CONTENT_RULES = {
    titleMin: 3,
    slugMin: 5,
    slugMax: 50,
    slugPattern: /^[a-zA-Z0-9_-]+$/,
    shortDescriptionMin: 20,
    shortDescriptionMax: 150,
    descriptionMin: 50,
}

export function errorCheckContent(content: IContentDoc) {
    let errors: {error: string, field: string}[] = []
    const warning = (key: string) => `Pages.Edit.contentType.slug.Warnings.${key}.description`

    if(!content.title || content.title.length < CONTENT_RULES.titleMin) {
        errors.push({error: warning("title_too_short"), field: "title"})
    }

    if(!content.creators || content.creators.length === 0) {
        errors.push({error: warning("creator_too_short"), field: "creators"})
    }

    const shortDescription = content.shortDescription ?? ""
    if(shortDescription.length < CONTENT_RULES.shortDescriptionMin) {
        errors.push({error: warning("short_description_too_short"), field: "shortDescription"})
    } else if(shortDescription.length > CONTENT_RULES.shortDescriptionMax) {
        errors.push({error: warning("short_description_too_long"), field: "shortDescription"})
    }

    if(!content.description || content.description.length < CONTENT_RULES.descriptionMin) {
        errors.push({error: warning("description_too_short"), field: "description"})
    }

    if(!content.tags || content.tags.filter((tag) => tag.length > 0).length === 0) {
        errors.push({error: warning("tags_too_short"), field: "tags"})
    }

    if(!content.images || content.images.length === 0) {
        errors.push({error: warning("images_too_short"), field: "images"})
    }

    const latest = content.files?.[0]
    if(!latest) {
        errors.push({error: warning("files_too_short"), field: "files"})
    } else {
        const versions = Array.isArray(latest.minecraftVersion) ? latest.minecraftVersion.filter((v) => v) : latest.minecraftVersion
        if(!versions || versions.length === 0) {
            errors.push({error: warning("files_no_minecraft_version"), field: "files.minecraftVersion"})
        }

        if(!latest.worldUrl && !latest.dataUrl && !latest.resourceUrl && !latest.url) {
            errors.push({error: warning("no_download_link"), field: "files.download"})
        }
    }

    return errors
}

/** @returns the API response ({error} on failure) */
export async function updateTranslation(slug: string, type: ContentTypes, translation: {[key: string]: {description: string, shortDescription: string, title: string}}, token: string | null) {
    try {
        let response = await fetch(`${process.env.DATA_URL}/creations/${encodeURIComponent(slug)}/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token + ''
            },
            body: JSON.stringify({
                type: type,
                translation: translation
            })
        })
        let data: any = undefined
        try { data = await response.json() } catch {}
        if (!response.ok) return { error: data?.error ?? `Request failed (${response.status})` }
        return data ?? {};
    } catch(e) {
        console.error("API fetch error! Is it running?: " + e)
        return {
            error: String(e)
        }
    }
}

export async function deleteContent(slug: string, token: string | null, contentType: CollectionNames) {
    try {
        let response = await fetch(`${process.env.DATA_URL}/creations/${encodeURIComponent(slug)}?type=${contentType}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token + ""
            }
        })
        if(!response.ok) {
            console.error("API fetch error! `deleteContent` Is it running?: " + response.statusText)
        }
        return response.ok;
    } catch(e) {
        throw {
            error: e
        }
    }
}

export async function requestApproval(slug: string, collectionName: CollectionNames, token: string | null) {
    let res: Response
    try {
        res = await fetch(`${process.env.DATA_URL}/creations/${encodeURIComponent(slug)}/request_approval?type=${collectionName}`, {
            method: 'GET',
            headers: {
                'Authorization': token + ""
            }
        })
    } catch(e) {
        throw {
            error: String(e)
        }
    }
    // Surface API failures (e.g. 401) to the caller instead of reporting success
    if(!res.ok) {
        let message = `Request failed (${res.status})`
        try {
            const data = await res.json()
            if(data?.error) message = data.error
        } catch(e) {}
        throw {
            error: message
        }
    }
}

/** @returns whether the API approved the creation */
export async function approveContent(slug: string, collectioName: CollectionNames, token: string | null) {
    try {
        const res = await fetch(`${process.env.DATA_URL}/creations/${encodeURIComponent(slug)}/approve?type=${collectioName}`, {
            headers: {
                'Authorization': token + ""
            }
        })
        return res.ok
    } catch(e) {
        console.error(e)
        return false
    }
}

export function convertToCollection(type: ContentTypes) {
    switch(type) {
        case ContentTypes.Maps:
            return CollectionNames.Maps
        case ContentTypes.Datapacks:
            return CollectionNames.Datapacks
        case ContentTypes.Resourcepacks:
            return CollectionNames.Resourcepacks
        default:
            return CollectionNames.Maps
    }
}

export function convertToType(collection?: CollectionNames) {
    switch(collection) {
        case CollectionNames.Maps:
            return ContentTypes.Maps
        case CollectionNames.Datapacks:
            return ContentTypes.Datapacks
        case CollectionNames.Resourcepacks:
            return ContentTypes.Resourcepacks
        default:
            return ContentTypes.Maps
    }
}

export function createEmptyCreation(): IContentDoc {
    return {
        title: "",
        shortDescription: "",
        description: "",
        creators: [],
        slug: "",
        status: 0,
        images: [],
        files: [],
        videoUrl: "",
        downloads: 0,
        views: 0,
        rating: 0,
        createdDate: Date.now(),
        _id: 0,
        tags: [""],
        type: ContentTypes.Maps
    }
}