import { revalidateTag } from "next/cache";

function formatQueryOptions(queryOptions) {
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
    if(!queryOptions.featured instanceof Boolean) {
        console.error("Featured must be either true or false")
    }

    if(!queryOptions.sort) {
        queryOptions.sort = "newest"
    }

    if(!queryOptions.search) {
        queryOptions.search = ""
    }
    return queryOptions
}

export async function getMaps(queryOptions) {
    queryOptions = formatQueryOptions(queryOptions);
    try {
        let response = await fetch(`${process.env.DATA_URL}/maps?featured=${queryOptions.featured}&limit=${queryOptions.limit}&skip=${queryOptions.skip}&sort=${queryOptions.sort}&search=${queryOptions.search}`)
        let data = await response.json();
        return data.documents;
    } catch(e) {
        console.error("API fetch error! Is it running?: " + e);
        return {
            error: e,
            query: queryOptions
        }
    }
    
}

export async function getFeatured() {
    let response = await fetch(`${process.env.DATA_URL}/maps?featured=true&limit=5`)
    let data = await response.json();
    return data;
}

export async function getNewest() {
    let response = await fetch(`${process.env.DATA_URL}/maps?limit=10`)
    let data = await response.json();
    return data
}

export async function getUpdated() {
    let response = await fetch(`${process.env.DATA_URL}/maps?sort=updated&limit=10`)
    let data = await response.json();
    return data;
}

export async function getMapCount(queryOptions) {
    queryOptions = formatQueryOptions(queryOptions);
    try {
        let response = await fetch(`${process.env.DATA_URL}/maps?featured=${queryOptions.featured}&limit=${queryOptions.limit}&skip=${queryOptions.skip}&sort=${queryOptions.sort}&search=${queryOptions.search}&sendCount=true`)
        let data = await response.json();
        return data.count;
    } catch(e) {
        console.error("API fetch error! Is it running?: " + e);
        return {
            error: e,
            query: queryOptions
        }
    }
}

export async function postRating(mapSlug, rating, map) {
    let response = await fetch(`${process.env.DATA_URL}/maps/rate/${mapSlug}`, { 
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({rating: rating, map: map})
    })
    let newRating = await response.json().rating
    try {
        revalidateTag(mapSlug)
    }
    catch(e) {

    }
    return newRating;
}

export async function postComment(mapSlug, username, comment) {
    await fetch(`${process.env.DATA_URL}/maps/comment/${mapSlug}`, {
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
        
    }
    return true
}