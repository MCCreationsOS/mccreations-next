"use client"

import { readAllNotifications, readNotification } from "@/app/api/auth";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

import { mutate } from "swr";
import { useUser, useToken } from "@/app/api/hooks/users";
import { Button } from "@/components/ui/button";
import PageNavigator from "@/components/Creations/Search/Navigator";
import { INotification } from "@/app/api/types";
import { Link } from "@/i18n/navigation";
import { useAllComments } from "@/app/api/hooks/comments";
import { Comment } from "@/components/Creations/Page/Comments";

export default function Notifications() {
    const page = parseInt(useSearchParams().get("page") ?? "0")
    const t = useTranslations()
    const { comments, total } = useAllComments(page)

    return <div className="flex flex-col gap-0 relative">
        <h3 className="text-2xl font-bold mb-2">{t('notification', { count: 2 })}</h3>
        {comments?.map(comment => <Comment comment={comment} />)}
        {comments?.length === 0 && <p>{t('Pages.Dashboard.Notifications.no_notifications')}</p>}
        {comments && comments.length > 0 && <PageNavigator page={page} pages={Math.ceil(total ?? 0 / 20.0)} />}
    </div>
}