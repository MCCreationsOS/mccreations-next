import { revalidateTag } from "next/cache";


export async function getMaps(queryOptions) {
    let limit = queryOptions.limit;
    let skip = queryOptions.skip;
    let featured = queryOptions.featured;
    let sort = queryOptions.sort;

    if(!limit) {
        limit = 0
    }
    if(limit > 20 || limit < 0) {
        console.error("Limit is above 20 or below 0")
    }

    if(!skip) {
        skip = 0;
    }
    if(skip < 0) {
        console.error("Skip cannot be less than 0")
    }

    if(featured === undefined) {
        featured = false
    }
    if(!featured instanceof Boolean) {
        console.error("Featured must be either true or false")
    }

    if(!sort) {
        sort = "newest"
    }
    try {
        let response = await fetch(`${process.env.DATA_URL}/maps?featured=${featured}&limit=${limit}&skip=${skip}&sort=${sort}`)
        let data = await response.json();
        return data;
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

export async function getMapCount() {
    let response = await fetch(`${process.env.DATA_URL}/maps/getCount`)
    let data = await response.json();
    return data.count;
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