import { CollectionNames, ContentTypes, IComment, IContentDoc, Leaderboard, QueryOptions, SortOptions } from "@/app/api/types";
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
        let response = await fetch(`${process.env.DATA_URL}/rate`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rating: rating, id: map._id, collection: convertToCollection(map.type) }),
            cache: 'no-store'
        })
        if (!response.ok) return undefined
        let newRating = (await response.json()).rating as number
        return newRating;
    }
    catch (e) {
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
export async function postComment(slug: string, content_type: string, username: string, comment: string, handle?: string, rating?: number, jwt?: string): Promise<IComment | undefined> {
    try {
        const response = await fetch(`${process.env.DATA_URL}/comment`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                // Optional: lets the API confirm the handle belongs to the signed-in user
                ...(jwt ? { 'Authorization': jwt } : {})
            },
            body: JSON.stringify({
                username: username,
                comment: comment,
                handle: handle,
                content_type: content_type,
                slug: slug,
                date: Date.now(),
                replies: [],
                likes: 0,
                rating: rating
            }),
            cache: 'no-store'
        })

        if (response.ok) {
            const createdComment = await response.json() as IComment;
            return createdComment;
        }
    }
    catch (e) {
        console.error(e);
    }
    return undefined;
}

export async function postReply(comment_id: string, username: string, reply: string, handle: string, jwt?: string): Promise<IComment | undefined> {
    try {
        const response = await fetch(`${process.env.DATA_URL}/comment/${encodeURIComponent(comment_id)}/reply`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                ...(jwt ? { 'Authorization': jwt } : {})
            },
            body: JSON.stringify({
                comment_id: comment_id,
                username: username,
                comment: reply,
                handle: handle,
                date: Date.now(),
                likes: 0
            }),
            cache: 'no-store'
        })

        if (response.ok) {
            const createdReply = await response.json() as IComment;
            return createdReply;
        }
    }
    catch (e) {
        console.error(e);
    }
    return undefined;
}

export async function likeComment(comment_id: string, jwt: string = "") {
    try {
        let response = await fetch(`${process.env.DATA_URL}/comment/${comment_id}/like`, {
            method: "GET",
            headers: {
                'Authorization': jwt
            },
            cache: 'no-store'
        })
        return response.status === 200
    }
    catch (e) {
        console.error(e);
    }
    return false
}

export async function fetchComments(slug?: string, options?: { page?: number, contentType?: string, limit?: number, sort?: SortOptions }) {
    try {
        const params = new URLSearchParams()
        if (slug) params.set("slug", slug)
        if (options?.contentType) params.set("content_type", options.contentType)
        if (options?.limit) params.set("limit", String(options.limit))
        if (options?.sort) params.set("sort", options.sort)
        if (options?.page) params.set("page", String(options.page))
        let data = await fetch(`${process.env.DATA_URL}/comments?${params}`, { next: { tags: ["comments"], revalidate: Infinity } })
        try {
            let json = await data.json()
            return json;
        } catch (e) {
            console.error(e)
        }
        return undefined
    } catch (e) {
        console.error(e)
    }
    return undefined;
}

export async function fetchComment(id: string) {
    try {
        let data = await fetch(`${process.env.DATA_URL}/comment/${id}`, { next: { tags: ["comment"], revalidate: Infinity } })
        try {
            let json = await data.json()
            return json;
        } catch (e) {
            console.error(e)
        }
        return undefined
    } catch (e) {
        console.error(e)
    }
    return undefined;
}

export async function updateComment(comment: IComment, jwt: string = "") {
    try {
        fetch(`${process.env.DATA_URL}/comment/${comment._id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            },
            body: JSON.stringify(comment),
            cache: 'no-store'
        })
    }
    catch (e) {
        console.error(e);
    }
}

export async function deleteComment(id: string, jwt: string = "") {
    const response = await fetch(`${process.env.DATA_URL}/comment/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
            'Authorization': jwt
        },
        cache: 'no-store'
    })
    if (!response.ok) {
        let message = "Failed to delete comment"
        try { message = (await response.json()).error ?? message } catch {}
        throw new Error(message)
    }
}

export async function getCreator(handle: string) {
    try {
        let data = await fetch(`${process.env.DATA_URL}/creator/${handle}`, { next: { tags: ["creator"], revalidate: 216000 } })
        try {
            if (data.status === 200) {
                let json = await data.json()
                return json;
            }
        } catch (e) {
            console.error(e)
        }
        return undefined
    } catch (e) {
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
        } catch (e) {
            console.error(e)
        }
        return undefined
    } catch (e) {
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
            }),
            cache: 'no-store'
        })
    }
    catch (e) {
        console.error(e);
    }
}