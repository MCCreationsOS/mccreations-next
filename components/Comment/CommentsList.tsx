import { Suspense, useEffect, useState } from "react"
import CommentCard from "./CommentCard"
import { postComment } from "@/app/api/community";
import { IComment, IUser } from "@/app/types";
import { getUser } from "@/app/api/auth";

export default function PretechedCommentsList({mapSlug, comments}: {mapSlug: string, comments: IComment[] | undefined}) {

    return (
        <div className='centered_content'>
            <h2>Comments</h2>
            {(comments && comments.length > 0 && comments[0].comment) ? comments.map((comment: IComment, idx: number) => <CommentCard key={idx} comment={comment} />) : <><div className="no_comments"><h3>None Yet!</h3><p>Be the first to comment!</p></div></>}
        </div>
    )
}