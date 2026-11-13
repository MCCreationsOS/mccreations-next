'use client';
import { use } from "react";

import { useComment } from "@/app/api/hooks/comments";
import { Comment } from "@/components/Creations/Page/Comments";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function CommentPage(props: {params: Promise<{locale: string, _id: string}>}) {
    const { _id } = use(props.params);
    const {comment, isLoading, notFound} = useComment(_id)
    const t = useTranslations('Pages.Comments._id')

    if (isLoading) return <div className="centered_content">{t('loading')}</div>
    if (notFound || !comment) return <div className="centered_content">{t('not_found')}</div>

    const parentLink = `/${comment.content_type.toLowerCase()}/${comment.slug}`

    return (
        <div className="max-w-2xl w-full mx-auto my-10 px-4 flex flex-col gap-4">
            <Link href={parentLink} className="underline w-fit">{t('view_creation')}</Link>
            <Comment comment={comment} />
        </div>
    )
}
