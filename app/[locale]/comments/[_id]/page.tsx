'use client'

import { fetchComment } from "@/app/api/community";
import { IComment } from "@/app/api/types";
import CommentCard from "@/components/Comment/CommentCard";
import { Metadata, ResolvingMetadata } from "next";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useEffect, useState } from "react";

export async function generateMetadata({ params }: {params: Params}, parent: ResolvingMetadata): Promise<Metadata> {
    const id = params._id
   
    // fetch data
    const comment: IComment = await fetchComment(id)

    if(!comment) return {
        title: "Comment Not Found",
        openGraph: {
            title: "Comment Not Found",
            description: "This comment does not appear to exist on MCCreations",
            images: [
            {
                url: "https://mccreations.net/defaultBanner.png"
            }
            ],
            siteName: "MCCreations",
            type: "article",
            url: "https://mccreations.net/comments/" + id
        }
    }
   
    return {
      title: `Comment by ${comment.username} made on ${comment.date} on MCCreations`,
      description: "It's a comment :shrug:",
      openGraph: {
        title: `Comment by ${comment.username} made on ${comment.date} on MCCreations`,
        description: "It's a comment :shrug:",
        images: [
          "https://mccreations.net/defaultBanner.png"
        ],
        siteName: "MCCreations",
        type: "article",
        url: "https://mccreations.net/comments/" + comment._id
      }
    }
}

export default function CommentPage({params: {locale, _id}}: {params: {locale: string, _id: string}}) {
    const [comment, setComment] = useState<IComment | undefined>()

    useEffect(() => {
        fetchComment(_id).then((comment) => {
            setComment(comment)
        })
    }, [])
    if(!comment) return <div>Loading...</div>
    return (
        <div>
            <CommentCard comment={comment}/>
        </div>
    )

}