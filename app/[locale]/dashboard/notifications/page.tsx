"use client"

import { readAllNotifications, readNotification } from "@/app/api/auth";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { useNotifications } from "@/app/api/hooks/notifications";
import { useUser, useToken } from "@/app/api/hooks/users";
import { Button } from "@/components/ui/button";
import PageNavigator from "@/components/Creations/Search/Navigator";
import { INotification } from "@/app/api/types";
import { Link, useRouter } from "@/i18n/navigation";

// Fix old notifications
function fixLegacyLink(link: string) {
    return link.replace(/^\/(map|datapack|resourcepack)\//, "/$1s/")
}

export default function Notifications() {
    const page = parseInt(useSearchParams().get("page") ?? "0") || 0
    const {user, isLoading} = useUser()
    const {token} = useToken()
    const router = useRouter()
    const t = useTranslations()
    const {notifications, total, setNotifications} = useNotifications(page)

    useEffect(() => {
        if(!isLoading && !user) {
            router.push("/signin?redirect=dashboard/notifications")
        }
    }, [isLoading, user, router])

    const readAll = async () => {
        const result = await readAllNotifications(token)
        if(result.ok) {
            setNotifications(notifications?.map(notification => ({...notification, read: true})) ?? [])
        } else {
            toast.error(t('Pages.Dashboard.Notifications.read_all_failed'))
        }
    }

    const markRead = (id: string) => {
        readNotification(token, id)
        setNotifications(notifications?.map(n => n._id === id ? {...n, read: true} : n) ?? [])
    }

    return <div className="flex flex-col gap-2">
            <div className="flex flex-row flex-wrap gap-2 items-center justify-between mb-2">
                <h3 className="text-2xl font-bold">{t('notification', {count : 2})}</h3>
                {notifications && notifications.some(n => !n.read) && <Button variant="secondary" onClick={readAll}><span className="text-sm">{t('Pages.Dashboard.Notifications.read_all')}</span></Button>}
            </div>
            {notifications?.map(notification => <Notification key={notification._id} notification={notification} onRead={markRead} />)}
            {notifications?.length === 0 && <p>{t('Pages.Dashboard.Notifications.no_notifications')}</p>}
            {notifications && notifications.length > 0 && <PageNavigator page={page} pages={Math.ceil((total ?? 0) / 20)} />}
    </div>
}

function Notification({notification, onRead} : {notification : INotification, onRead: (id: string) => void}) {
    const t = useTranslations()

    return <Link href={fixLegacyLink(notification.link)} className="bg-secondary hover:bg-white/10 small-button-shadow relative border-2 border-black" onClick={() => onRead(notification._id + "")}>
        <div className="p-3 flex flex-row gap-4 items-center">
            <div className={`w-2 h-2 ml-2 bg-red-500 ${notification.read ? 'invisible' : ''}`} aria-hidden="true"></div>
            <div className="flex flex-col gap-1">
                <p className="text-sm font-bold">{(typeof notification.title === 'string') ? notification.title : t(notification.title.key, notification.title.options)}</p>
                <p className="text-sm">{(typeof notification.body === 'string') ? notification.body : t(notification.body.key, notification.body.options)}</p>
            </div>
        </div>
    </Link>
}
