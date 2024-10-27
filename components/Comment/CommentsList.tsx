'use client'

import CommentCard from "./CommentCard"
import { fetchComments, postComment } from "@/app/api/community";
import { CollectionNames, IComment, IUser, SortOptions } from "@/app/api/types";
import { getUser } from "@/app/api/auth";
import {useTranslations} from 'next-intl';
import { useComments } from "@/app/api/hooks/comments";
import styles from './Comment.module.css'

/**
 * A list of comments that are cached with the map, this component should be improved to initially display the cached comments and then fetch any new ones
 * @param mapSlug The slug of the map - Not currently used
 * @param comments The comments to display 
 */
export default function CommentsList({mapSlug, content_type}: {mapSlug: string, content_type: CollectionNames}) {
    const t = useTranslations()
    const {comments, isLoading, error} = useComments(mapSlug, content_type, SortOptions.Newest, 20)

    if(error) return <div className="centered_content">{t('CommentsList.error')}</div>
    if(isLoading) return <div className="centered_content">{t('CommentsList.loading')}</div>

    return (
        <div className='centered_content'>
            <h2 id="comments_title">{t('CommentsList.title')}</h2>
            {(comments && comments.length > 0 && comments[0].comment) ? <div className={styles.comments_list}>{comments.map((comment: IComment, idx: number) => <CommentCard key={comment._id} comment={comment} contentType={content_type} handle={mapSlug} canReply={true}/>)}</div> : <><div className="no_comments"><h3>{t('CommentsList.none_yet')}</h3><p>{t('CommentsList.no_comments')}</p></div></>}
        </div>
    )
}