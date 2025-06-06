'use client'

import { useComment } from "@/app/api/hooks/comments";
import CommentCard from "@/components/Comment/CommentCard";
import { useTranslations } from "next-intl";


export default function CommentPage({params: {locale, _id}}: {params: {locale: string, _id: string}}) {
    const {comment, isLoading, error} = useComment(_id)
    const t = useTranslations('Pages.Comments.[_id]')

    if(!comment || isLoading) return <div>{t('loading')}</div>

    return (
        <div className="centered_content">
            <CommentCard comment={comment} contentType="wall" handle={comment.slug} canReply={true} />
        </div>
    )

}