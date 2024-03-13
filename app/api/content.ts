import { IMap, QueryOptions, SortOptions } from "../types"

/** 
 * Format query options for a fetch request. This should be run before any request to the API to avoid
 * sending undefined values
 * @param queryOptions The query options to format
 * @returns The formatted queryOptions
*/
function formatQueryOptions(queryOptions: QueryOptions) {
   
    // Define a limit if there is none defined
    if(!queryOptions.limit) {
        queryOptions.limit = 0
    }

    // Define a skip amount of there is none defined
    if(!queryOptions.skip) {
        queryOptions.skip = 0;
    }

    // Error if the skip is set incorrectly
    if(queryOptions.skip < 0) {
        console.error("Skip cannot be less than 0")
    }

    // Defines status if it is not defined
    if(!queryOptions.status) {
        queryOptions.status = 2
    }

    if(!queryOptions.version) {
        queryOptions.version = ""
    }

    // Defines sort if it is not defined
    if(!queryOptions.sort) {
        queryOptions.sort = SortOptions.Newest
    }

    // Defines search if it is not defined
    if(!queryOptions.search) {
        queryOptions.search = ""
    }
    return queryOptions
}

/**
 * Fetch an array of maps from the API
 * @param queryOptions The query options to send to the API
 * @param count Return the count of maps found rather than the actual maps. Used for pagination. For performance reasons
 * when this parameter is set ONLY the count of maps is returned not the actual map objects
 * @returns An array of map documents
 * @returns The count of maps found by the query
*/
export async function fetchMaps(queryOptions: QueryOptions, count: boolean) {
    queryOptions = formatQueryOptions(queryOptions);
    try {
        let response = await fetch(`${process.env.DATA_URL}/maps?status=${queryOptions.status}&limit=${queryOptions.limit}&skip=${queryOptions.skip}&sort=${queryOptions.sort}&search=${queryOptions.search}&sendCount=${count}&version=${queryOptions.version}`, {next:{revalidate:3600}})
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

export async function importContent(link: string, token?: string | null) {
    try {
        console.log('Sending import request')
        let response = await fetch(`${process.env.DATA_URL}/content/import`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: link,
                token: token
            })
        })
        let data = await response.json();
        console.log(data)
        return data;
    } catch(e) {
        console.error("API fetch error! Is it running?: " + e)
        return {
            error: e
        }
    }
}

export async function updateContent(map: IMap, token?: string | null) {
    try {
        console.log('Sending update request')
        let response = await fetch(`${process.env.DATA_URL}/content/update`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: map,
                token: token
            })
        })
        let data = await response.json();
        console.log(data)
        return data;
    } catch(e) {
        console.error("API fetch error! Is it running?: " + e)
        return {
            error: e
        }
    }
}