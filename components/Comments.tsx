'use client'

import { Suspense, useEffect, useState } from "react"
import CommentCard from "./cards/CommentCard"
import { postComment } from "@/app/api/community";
import { IComment, IUser } from "@/app/types";
import { getUser } from "@/app/api/auth";

export default function Comments({mapSlug, comments}: {mapSlug: string, comments: IComment[] | undefined}) {
    const [commentsState, setComments] = useState(comments!)

    return (
        <div className='centered_content'>
            <h2>Comments</h2>
            {(commentsState && commentsState.length > 0 && commentsState[0].comment) ? commentsState.map((comment: IComment, idx: number) => <Suspense><CommentCard key={idx} comment={comment} /></Suspense>) : <><div className="no_comments"><h3>None Yet!</h3><p>Be the first to comment!</p></div></>}
        </div>
    )
}