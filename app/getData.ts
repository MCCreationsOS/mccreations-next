import { revalidateTag } from "next/cache";
import { IMap } from "./types";

export enum SortOptions {
    Newest = "newest",
    Oldest = "oldest",
    Updated = "updated",
    TitleAscending = "tile_ascending",
    TitleDescending = "title_descending",
    HighestRated = "highest_rated",
    LowestRated = "lowest_rated",
    CreatorAscending = "creator_ascending",
    CreatorDescending = "creator_descending",
    BestMatch = "best_match"
}

export interface QueryOptions {
    limit?: number;
    skip?: number;
    featured?: boolean;
    sort?: SortOptions;
    search?: string ;
}

function formatQueryOptions(queryOptions: QueryOptions) {
    let limit = queryOptions.limit;
    let skip = queryOptions.skip;
    let featured = queryOptions.featured;
    let sort = queryOptions.sort;
    let search = queryOptions.search

    if(!queryOptions.limit) {
        queryOptions.limit = 0
    }
    if(queryOptions.limit > 20 || queryOptions.limit < 0) {
        console.error("Limit is above 20 or below 0")
    }

    if(!queryOptions.skip) {
        queryOptions.skip = 0;
    }
    if(queryOptions.skip < 0) {
        console.error("Skip cannot be less than 0")
    }

    if(queryOptions.featured === undefined) {
        queryOptions.featured = false
    }

    if(!queryOptions.sort) {
        queryOptions.sort = SortOptions.Newest
    }

    if(!queryOptions.search) {
        queryOptions.search = ""
    }
    return queryOptions
}

export async function fetchMaps(queryOptions: QueryOptions, count: boolean) {
    queryOptions = formatQueryOptions(queryOptions);
    try {
        console.log(`${process.env.DATA_URL}/maps?featured=${queryOptions.featured}&limit=${queryOptions.limit}&skip=${queryOptions.skip}&sort=${queryOptions.sort}&search=${queryOptions.search}&sendCount=${count}`)
        let response = await fetch(`${process.env.DATA_URL}/maps?featured=${queryOptions.featured}&limit=${queryOptions.limit}&skip=${queryOptions.skip}&sort=${queryOptions.sort}&search=${queryOptions.search}&sendCount=${count}`, {next:{revalidate:3600}})
        let data = await response.json();
        if(count) {
            return data.count
        } else {
            return data.documents
        }
    } catch(e) {
        console.error("API fetch error! Is it running?: " + e);
        return {
            error: e,
            query: queryOptions
        }
    }
}

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

export async function postRating(mapSlug: string, rating: number, map: IMap) {
    let response = await fetch(`${process.env.DATA_URL}/maps/rate/${mapSlug}`, { 
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({rating: rating, map: map})
    })
    let newRating = (await response.json()).rating
    try {
        revalidateTag(mapSlug)
    }
    catch(e) {

    }
    return newRating;
}

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
        return true
    }
    return true
}