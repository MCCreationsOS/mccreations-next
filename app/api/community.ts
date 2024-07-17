import { revalidateTag } from "next/cache";
import { IContentDoc } from "@/app/api/types";

/**
 * Rate a map
 * @param rating The rating to send
 * @param map The map to send the rating to. We pass the whole map object to avoid having to fetch it again
 * on the database since we know we have it here.
 * @returns The new rating of the map
 */
export async function postRating(rating: number, map: IContentDoc) {
    try {
        let response = await fetch(`${process.env.DATA_URL}/content/rate/${map.slug}`, { 
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({rating: rating, map: map})
        })
        let newRating = (await response.json()).rating as number
        revalidateTag(map.slug)
        return newRating;
    }
    catch(e) {
        console.error(e);
    }
}

/**
 * Post a comment to a map
 * @param mapSlug The map to post a comment to
 * @param username The username of the user who sent the comment
 * @param comment The actual comment
 * @param account The UID of the poster of the comment
 */
export async function postComment(slug: string, content_type: string, username: string, comment: string, handle?: string) {
    try {
        fetch(`${process.env.DATA_URL}/maps/comment/${slug}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                comment: comment,
                handle: handle,
                content_type: content_type
            })
        })
        revalidateTag(slug)
    }
    catch(e) {
        console.error(e);
    }
}

export async function getCreator(handle: string) {
    try {
        let data = await fetch(`${process.env.DATA_URL}/creator/${handle}`, { next: { tags: ["creator"], revalidate: Infinity }})
        try {
            let json = await data.json()
            return json;
        } catch(e) {
            console.error(e)
        }
        return undefined
    } catch(e) {
        console.error(e)
    }
    return undefined;
}