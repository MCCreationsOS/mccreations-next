'use client'

import { fetchComment } from "@/app/api/community";
import { IComment } from "@/app/api/types";
import CommentCard from "@/components/Comment/CommentCard";
import { useEffect, useState } from "react";


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