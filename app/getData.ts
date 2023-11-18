import { revalidateTag } from "next/cache";
import { ErrorMessage, IMap, QueryOptions, SortOptions } from "./types";

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

    // Limit should not exceed 20 for performance reasons
    if(queryOptions.limit > 20 || queryOptions.limit < 0) {
        console.error("Limit is above 20 or below 0")
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
        console.log(`Send request ${process.env.DATA_URL}/maps?status=${queryOptions.status}&limit=${queryOptions.limit}&skip=${queryOptions.skip}&sort=${queryOptions.sort}&search=${queryOptions.search}&sendCount=${count}&version=${queryOptions.version}`)
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
export async function fetchMap(slug: string) {
    try {
        let response = await fetch(`${process.env.DATA_URL}/maps/${slug}`, { next: { tags: [slug], revalidate: 3600 }})
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
 * Rate a map
 * @param rating The rating to send
 * @param map The map to send the rating to. We pass the whole map object to avoid having to fetch it again
 * on the database since we know we have it here.
 * @returns The new rating of the map
 */
export async function postRating(rating: number, map: IMap) {
    let response = await fetch(`${process.env.DATA_URL}/maps/rate/${map.slug}`, { 
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({rating: rating, map: map})
    })
    let newRating = (await response.json()).rating as number
    try {
        revalidateTag(map.slug)
    }
    catch(e) {
        console.error(e);
    }
    return newRating;
}

/**
 * Post a comment to a map
 * @param mapSlug The map to post a comment to
 * @param username The username of the user who sent the comment
 * @param comment The actual comment
 */
export async function postComment(mapSlug: string, username: string, comment: string) {
    fetch(`${process.env.DATA_URL}/maps/comment/${mapSlug}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: username, comment: comment})
    })
    try {
        revalidateTag(mapSlug)
    }
    catch(e) {
        console.error(e);
    }
}