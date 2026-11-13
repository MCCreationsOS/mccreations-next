"use client"

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import PageNavigator from "@/components/Creations/Search/Navigator";
import { useAllComments } from "@/app/api/hooks/comments";
import { Comment } from "@/components/Creations/Page/Comments";

export default function DashboardComments() {
    const page = parseInt(useSearchParams().get("page") ?? "0") || 0
    const t = useTranslations()
    const { comments, total } = useAllComments(page)

    return <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-bold mb-2">{t('comment', { count: 2 })}</h3>
        {comments?.map(comment => <Comment key={comment._id} comment={comment} />)}
        {comments?.length === 0 && <p>{t('Pages.Dashboard.Comments.empty')}</p>}
        {comments && comments.length > 0 && <PageNavigator page={page} pages={Math.ceil((total ?? 0) / 20)} />}
    </div>
}
