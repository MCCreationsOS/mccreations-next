import { revalidateTag } from "next/cache";
import { CollectionNames, ContentTypes, IComment, IContentDoc, Leaderboard, QueryOptions } from "@/app/api/types";
import { convertToCollection, formatQueryOptions } from "./content";

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
        fetch(`${process.env.DATA_URL}/content/comment/${slug}`, {
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
    }
    catch(e) {
        console.error(e);
    }
}

export async function postReply(comment_id: string, username: string, reply: string, handle: string) {
    try {
        fetch(`${process.env.DATA_URL}/content/comment_reply`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                comment_id: comment_id,
                username: username,
                reply: reply,
                handle: handle
            })
        })
    }
    catch(e) {
        console.error(e);
    }
}

export async function likeComment(comment_id: string, jwt: string = "") {
    try {
        let response =await fetch(`${process.env.DATA_URL}/content/comment_like`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            },
            body: JSON.stringify({comment_id: comment_id})
        })
        return response.status === 200
    }
    catch(e) {
        console.error(e);
    }
    return false
}

export async function fetchComments(slug: string, options: QueryOptions) {
    let opts = formatQueryOptions(options)
    try {
        let data = await fetch(`${process.env.DATA_URL}/content/comments-nosearch?slug=${slug}&content_type=${opts.contentType}&limit=${opts.limit}&page=${opts.page}&sort=${opts.sort}&creator=${opts.creator}`, { next: { tags: ["comments"], revalidate: Infinity }})
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

export async function fetchComment(id: string) {
    try {
        let data = await fetch(`${process.env.DATA_URL}/content/comment/${id}`, { next: { tags: ["comment"], revalidate: Infinity }})
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

export async function updateComment(comment: IComment, jwt: string = "") {
    try {
        fetch(`${process.env.DATA_URL}/content/comment/update`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            },
            body: JSON.stringify(comment)
        })
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

export async function getLeaderboard(contentType: ContentTypes, slug: string) {
    try {
        let data = await fetch(`${process.env.DATA_URL}/leaderboards/${convertToCollection(contentType)}/${slug}`)
        try {
            let json = await data.json()
            return json as Leaderboard;
        } catch(e) {
            console.error(e)
        }
        return undefined
    } catch(e) {
        console.error(e)
    }
    return undefined;
}

export async function submitLeaderboard(contentType: ContentTypes, slug: string, score: number, score_type: string, username: string, jwt: string = "") {
    try {
        fetch(`${process.env.DATA_URL}/leaderboards/${convertToCollection(contentType)}/${slug}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            },
            body: JSON.stringify({
                score: score,
                username: username,
                score_type: score_type
            })
        })
    }
    catch(e) {
        console.error(e);
    }
}