
import { ICreator, IContentDoc, QueryOptions, SortOptions, CollectionNames, ContentTypes } from "./types"
/** 
 * Format query options for a fetch request. This should be run before any request to the API to avoid
 * sending undefined values
 * @param queryOptions The query options to format
 * @returns The formatted queryOptions
*/
export function formatQueryOptions(queryOptions: QueryOptions) {
   
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

    if(!queryOptions.creator) {
        queryOptions.creator = ""
    }

    return queryOptions
}

/**
 * Search for content based on a query
 * @param queryOptions The query options to send to the API
 * @param count Return the count of maps found rather than the actual maps. Used for pagination. For performance reasons
 * when this parameter is set ONLY the count of maps is returned not the actual map objects
 * @returns `documents` An array of map documents
 * @returns `count` The count of maps found by the query
*/
export async function searchContent(queryOptions: QueryOptions, count: boolean, filterQuery?: QueryOptions, token?: string | null) {
    queryOptions = formatQueryOptions(queryOptions);
    try {
        let p1 = fetch(`${process.env.DATA_URL}/content?contentType=${queryOptions.contentType}&status=${queryOptions.status}&limit=${queryOptions.limit}&page=${queryOptions.page}&sort=${queryOptions.sort}&search=${queryOptions.search}&sendCount=${count}&exclusiveStatus=${queryOptions.exclusiveStatus}&includeTags=${queryOptions.includeTags}&excludeTags=${queryOptions.excludeTags}`, {
            next:{
                revalidate:3600
            },
            method: 'GET',
            headers: {
                authorization: token + ""
            }
        })
        let p2: Promise<Response> | undefined;
        if(filterQuery) {
            filterQuery = formatQueryOptions(filterQuery);
            // console.log(filterQuery)
            p2 = fetch(`${process.env.DATA_URL}/content?contentType=${filterQuery.contentType}&status=${filterQuery.status}&limit=${filterQuery.limit}&page=${filterQuery.page}&sort=${filterQuery.sort}&search=${filterQuery.search}&sendCount=${count}&exclusiveStatus=${filterQuery.exclusiveStatus}&includeTags=${filterQuery.includeTags}&excludeTags=${filterQuery.excludeTags}`, {
                next:{
                    revalidate:3600
                },
                method: 'GET',
                headers: {
                    authorization: token + ""
                }
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
        console.error("API fetch error! Is it running?: " + e);
        return {
            error: e,
            query: queryOptions
        }
    }
}

export async function getContent(queryOptions: QueryOptions, token?: string | null) {
    queryOptions = formatQueryOptions(queryOptions);
    try {
        let response = await fetch(`${process.env.DATA_URL}/content-nosearch?contentType=${queryOptions.contentType}&status=${queryOptions.status}&limit=${queryOptions.limit}&page=${queryOptions.page}&sort=${queryOptions.sort}&search=${queryOptions.search}&sendCount=false&exclusiveStatus=${queryOptions.exclusiveStatus}&includeTags=${queryOptions.includeTags}&excludeTags=${queryOptions.excludeTags}&creator=${queryOptions.creator}`, {
            next:{
                revalidate:3600
            },
            headers: {
                authorization: token + ""
            }
        })
        let data = await response.json();
        return data
    } catch(e) {
        console.error("API fetch error! Is it running?: " + e);
        return {
            error: e,
            query: queryOptions
        }
    }
}

export async function getFeed(token: string | null, limit: number, page: number) {
    try {
        let response = await fetch(`${process.env.DATA_URL}/content/feed?limit=${limit}&page=${page}`, {
            headers: {
                authorization: token + ""
            }
        })
        let data = await response.json();
        return data
    } catch(e) {
        console.error("API fetch error! Is it running?: " + e);
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
        let response = await fetch(`${process.env.DATA_URL}/maps/${slug}`, { 
            next: { tags: [slug], revalidate: 3600 },
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

/**
 * Fetch a single datapack from the API by slug
 * @param slug The slug of the datapack to fetch
 * @returns A single datapack document.
 */
export async function fetchDatapack(slug: string, token?: string) {
    try {
        let response = await fetch(`${process.env.DATA_URL}/datapacks/${slug}`, { 
            next: { tags: [slug], revalidate: 3600 },
            headers: {
                authorization: token + ""
            }
        })
        let data = await response.json();
        return data
    } catch (e: any) {
        console.error("API fetch error! Is it running?: " + e);
        return JSON.stringify({
            error: e.toString(),
            query: slug
        })
    }
}

/**
 * Fetch a single resourcepack from the API by slug
 * @param slug The slug of the resourcepack to fetch
 * @returns A single resourcepack document.
 */
export async function fetchResourcepack(slug: string, token?: string) {
    try {
        let response = await fetch(`${process.env.DATA_URL}/resourcepacks/${slug}`, { 
            next: { tags: [slug], revalidate: 3600 },
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

export async function fetchTags(type: CollectionNames) {
    try {
        let response = await fetch(`${process.env.DATA_URL}/tags/${type}`)
        let data = await response.json();
        return data
    } catch (e) {
        console.error("API fetch error! Is it running?: " + e);
        return {
            error: e
        }
    }
}

export async function downloadCreation(slug: string, contentType: ContentTypes) {
    try {
        await fetch(`${process.env.DATA_URL}/${contentType}s/${slug}/download`)
        return;
    } catch (e) {
        console.error("API fetch error! Is it running?: " + e);
        return {
            error: e,
            query: slug
        }
    }
}

export async function createNewContent(title: string, type: string, summary: string, token?: string | null) {
    if(!token) token = ""
    try {
        let res = await fetch(`${process.env.DATA_URL}/content`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                content: {
                    title: title,
                    type: type,
                    summary: summary
                }
            })
        })
        let b = await res.json();
        return b
    } catch(e) {
        console.error("API fetch error! Is it running?: " + e)
        return {
            error: e
        }
    }
}

// Consider moving import to a worker thread

export async function importContent(link: string, type: string, token?: string | null) {
    try {
        let response = await fetch(`${process.env.DATA_URL}/content/import`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: link,
                type: type,
                token: token
            })
        })
        let data = await response.json();
        return data;
    } catch(e) {
        console.error("API fetch error! Is it running?: " + e)
        return {
            error: e
        }
    }
}

export async function updateContent(map: IContentDoc, token: string | null, type: CollectionNames, dontSendDate?: boolean) {
    try {
        let response = await fetch(`${process.env.DATA_URL}/content/update`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token + ""
            },
            body: JSON.stringify({
                content: map,
                token: token,
                dontUpdateDate: dontSendDate,
                type: type
            })
        })
        let data = await response.json();
        return data;
    } catch(e) {
        console.error("API fetch error! Is it running?: " + e)
        return {
            message: e
        }
    }
}

export function errorCheckContent(content: IContentDoc) {
    let errors: {error: string, field: string}[] = []

    if(!content.title) {
        errors.push({error: "Content.Warnings.no_title.description", field: "title"})
    }

    if(!content.creators || content.creators.length === 0) {
        errors.push({error: "Content.Warnings.no_creators.description", field: "creators"})
    }

    if(!content.shortDescription) {
        errors.push({error: "Content.Warnings.no_short_description.description", field: "shortDescription"})
    }

    if(content.shortDescription && content.shortDescription.length < 40) {
        errors.push({error: "Content.Warnings.short_description_too_short.description", field: "shortDescription"})
    }

    if(!content.description) {
        errors.push({error: "Content.Warnings.no_description.description", field: "description"})
    }

    if(content.description && content.description.length < 100) {
        errors.push({error: "Content.Warnings.description_too_short.description", field: "description"})
    }

    if(!content.files || content.files.length === 0) {
        errors.push({error: "Content.Warnings.no_files.description", field: "files"})
    }

    if(!content.tags || content.tags.length === 0) {
        errors.push({error: "Content.Warnings.no_tags.description", field: "tags"})
    }

    if(!content.images || content.images.length === 0) {
        errors.push({error: "Content.Warnings.no_images.description", field: "images"})
    }

    if(!content.files || content.files.length > 0) {
        if(!content.files || !content.files[0].minecraftVersion) {
            errors.push({error: "Content.Warnings.no_minecraft_version.description", field: "files.minecraftVersion"})
        }

        if(!content.files || (!content.files[0].worldUrl && !content.files[0].dataUrl && !content.files[0].resourceUrl && !content.files[0].url)) {
            errors.push({error: "Content.Warnings.no_download_link.description", field: "files.download"})
        }
    }

    return errors
}

export async function updateTranslation(slug: string, type: CollectionNames, translation: {[key: string]: {description: string, shortDescription: string, title: string}}, token: string | null) {
    try {
        let response = await fetch(`${process.env.DATA_URL}/content/update_translation`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token + ''
            },
            body: JSON.stringify({
                slug: slug,
                type: type,
                translation: translation
            })
        })
        let data = await response.json();
        return data;
    } catch(e) {
        console.error("API fetch error! Is it running?: " + e)
        return {
            message: e
        }
    }
}

export async function deleteContent(id: any, token: string | null, contentType: CollectionNames) {
    try {
        await fetch(`${process.env.DATA_URL}/content`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token + ""
            },
            body: JSON.stringify({
                id: id,
                type: contentType
            })
        })
        return;
    } catch(e) {
        throw {
            error: e
        }
    }
}

export async function requestApproval(slug: string, collectionName: CollectionNames, token: string | null) {
    try {
        await fetch(`${process.env.DATA_URL}/content/request_approval`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token + ""
            },
            body: JSON.stringify({
                slug: slug,
                type: collectionName
            })
        })
        return;
    } catch(e) {
        throw {
            error: e
        }
    }
}

export async function approveContent(slug: string, collectioName: CollectionNames, token: string | null) {
    try {
        await fetch(`${process.env.DATA_URL}/content/${slug}/approve?contentType=${collectioName}`, {
            headers: {
                'Authorization': token + ""
            }
        })
        return;
    } catch(e) {
        throw {
            error: e
        }
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