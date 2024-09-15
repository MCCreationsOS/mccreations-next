'use client'

import CommentCard from "./CommentCard"
import { fetchComments, postComment } from "@/app/api/community";
import { CollectionNames, IComment, IUser, SortOptions } from "@/app/api/types";
import { getUser } from "@/app/api/auth";
import {useTranslations} from 'next-intl';
import { useEffect, useState } from "react";

/**
 * A list of comments that are cached with the map, this component should be improved to initially display the cached comments and then fetch any new ones
 * @param mapSlug The slug of the map - Not currently used
 * @param comments The comments to display 
 */
export default function CommentsList({mapSlug, content_type}: {mapSlug: string, content_type: CollectionNames}) {
    const t = useTranslations()
    const [comments, setComments] = useState<IComment[] | undefined>()

    useEffect(() => {
        getComments()
    }, [])

    const getComments = () => {
        fetchComments(mapSlug, {contentType: content_type, sort: SortOptions.Newest, limit: 20}).then((comments) => {
            setComments(comments.documents)
        })
    }

    return (
        <div className='centered_content'>
            <h2>{t('CommentsList.title')}</h2>
            {(comments && comments.length > 0 && comments[0].comment) ? comments.map((comment: IComment, idx: number) => <CommentCard key={idx} comment={comment} />) : <><div className="no_comments"><h3>{t('CommentsList.none_yet')}</h3><p>{t('CommentsList.no_comments')}</p></div></>}
        </div>
    )
}