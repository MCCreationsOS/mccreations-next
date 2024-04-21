import { Suspense, useEffect, useState } from "react"
import CommentCard from "./CommentCard"
import { postComment } from "@/app/api/community";
import { IComment, IUser } from "@/app/types";
import { getUser } from "@/app/api/auth";

/**
 * A list of comments that are cached with the map, this component should be improved to initially display the cached comments and then fetch any new ones
 * @param mapSlug The slug of the map - Not currently used
 * @param comments The comments to display 
 */
export default function PrefetchedCommentsList({mapSlug, comments}: {mapSlug: string, comments: IComment[] | undefined}) {

    return (
        <div className='centered_content'>
            <h2>Comments</h2>
            {(comments && comments.length > 0 && comments[0].comment) ? comments.map((comment: IComment, idx: number) => <CommentCard key={idx} comment={comment} />) : <><div className="no_comments"><h3>None Yet!</h3><p>Be the first to comment!</p></div></>}
        </div>
    )
}