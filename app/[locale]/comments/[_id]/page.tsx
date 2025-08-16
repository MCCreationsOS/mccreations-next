'use client';
import { use } from "react";

import { useComment } from "@/app/api/hooks/comments";
import { Comment } from "@/components/Creations/Page/Comments";
import { useTranslations } from "next-intl";


export default function CommentPage(props: {params: Promise<{locale: string, _id: string}>}) {
    const params = use(props.params);

    const {
        locale,
        _id
    } = params;

    const {comment, isLoading, error} = useComment(_id)
    const t = useTranslations('Pages.Comments._id')

    if(!comment || isLoading) return <div>{t('loading')}</div>

    return (
        <div className="w-1/2 mx-auto my-10">
            <Comment comment={comment} />
        </div>
    )
}