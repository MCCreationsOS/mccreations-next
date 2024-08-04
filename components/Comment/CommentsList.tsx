'use client'

import CommentCard from "./CommentCard"
import { fetchComments, postComment } from "@/app/api/community";
import { ContentTypes, IComment, IUser } from "@/app/api/types";
import { getUser } from "@/app/api/auth";
import { useI18n } from "@/locales/client";
import { useEffect, useState } from "react";

/**
 * A list of comments that are cached with the map, this component should be improved to initially display the cached comments and then fetch any new ones
 * @param mapSlug The slug of the map - Not currently used
 * @param comments The comments to display 
 */
export default function CommentsList({mapSlug, content_type}: {mapSlug: string, content_type: ContentTypes}) {
    const t = useI18n();
    const [comments, setComments] = useState<IComment[] | undefined>()

    useEffect(() => {
        getComments()
    }, [])

    const getComments = () => {
        fetchComments(mapSlug, content_type).then((comments) => {
            setComments(comments)
        })
    }

    return (
        <div className='centered_content'>
            <h2>{t('content.comments')}</h2>
            {(comments && comments.length > 0 && comments[0].comment) ? comments.map((comment: IComment, idx: number) => <CommentCard key={idx} comment={comment} />) : <><div className="no_comments"><h3>{t('content.no_comments.title')}</h3><p>{t('content.no_comments.description')}</p></div></>}
        </div>
    )
}