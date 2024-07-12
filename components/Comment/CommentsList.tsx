import { Suspense, useEffect, useState } from "react"
import CommentCard from "./CommentCard"
import { postComment } from "@/app/api/community";
import { IComment, IUser } from "@/app/api/types";
import { getUser } from "@/app/api/auth";
import { useI18n } from "@/locales/client";

/**
 * A list of comments that are cached with the map, this component should be improved to initially display the cached comments and then fetch any new ones
 * @param mapSlug The slug of the map - Not currently used
 * @param comments The comments to display 
 */
export default function PrefetchedCommentsList({mapSlug, comments}: {mapSlug: string, comments: IComment[] | undefined}) {
    const t = useI18n();
    return (
        <div className='centered_content'>
            <h2>{t('content.comments')}</h2>
            {(comments && comments.length > 0 && comments[0].comment) ? comments.map((comment: IComment, idx: number) => <CommentCard key={idx} comment={comment} />) : <><div className="no_comments"><h3>{t('content.no_comments.title')}</h3><p>{t('content.no_comments.description')}</p></div></>}
        </div>
    )
}