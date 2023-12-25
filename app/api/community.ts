import { revalidateTag } from "next/cache";
import { IMap } from "../types";

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
 * @param account The UID of the poster of the comment
 */
export async function postComment(mapSlug: string, username: string, comment: string, handle?: string) {
    fetch(`${process.env.DATA_URL}/maps/comment/${mapSlug}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: username, comment: comment, handle: handle})
    })
    try {
        revalidateTag(mapSlug)
    }
    catch(e) {
        console.error(e);
    }
}

export async function getCreator(handle: string) {
    let data = await fetch(`${process.env.DATA_URL}/creator/${handle}`, { next: { tags: ["creator"], revalidate: Infinity }})
    return (await data.json())
}