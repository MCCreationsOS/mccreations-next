"use client"

import { readAllNotifications, readNotification } from "@/app/api/auth";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

import styles from "../dashboard.module.css"
import { useNotifications } from "@/app/api/hooks/notifications";
import { mutate } from "swr";
import { useUser, useToken } from "@/app/api/hooks/users";
import { Button } from "@/components/ui/button";
import PageNavigator from "@/components/Creations/Search/Navigator";
import { INotification } from "@/app/api/types";
import { Link } from "@/app/api/navigation";

export default function Notifications() {
    const page = parseInt(useSearchParams().get("page") ?? "0")
    const {user} = useUser()
    const {token} = useToken()
    const router = useRouter()
    const t = useTranslations()
    const {notifications, total} = useNotifications(page)

    
    if(!user || user?._id === "") {
        router.push("/signin")
    }

    const readAll = () => {
        mutate(notifications?.map(notification => ({...notification, read: true})) || [])
        readAllNotifications(token + "")
    }

    return <div className="flex flex-col gap-0 relative">
            <h3 className="text-2xl font-bold mb-2">{t('notification', {count : 2})}</h3>
            <Button variant="secondary" className="absolute right-0" onClick={readAll}><span className="text-sm">{t('Account.Notifications.read_all')}</span></Button>
            {notifications?.map(notification => <Notification notification={notification} />)}
            {notifications?.length === 0 && <p>{t('Account.Notifications.no_notifications')}</p>}
            {notifications && notifications.length > 0 && <PageNavigator page={page} pages={Math.ceil(total ?? 0 / 20.0)} />}
    </div>
}

function Notification({notification} : {notification : INotification}) {
    const t = useTranslations()
    const {token} = useToken()
    let link = notification.link

    if(link.includes("wall")) {
        let creator = link.split("/")[2]
        link = `/creator/${creator}#wall_title`
    } else {
        link = link + "#comments_title"
    }

    const handleClick = () => {
        readNotification(token + "", notification._id + "")
    }

    return <Link href={link} className="bg-secondary hover:bg-white/10 small-button-shadow relative border-2 border-black" onClick={handleClick}>
        <div className="p-3 flex flex-row gap-4 items-center">
            <div className="w-2 h-2 ml-2 bg-red-500" style={{display: (notification.read) ? "none" : "block"}}></div>
            <div className="flex flex-col gap-1">
                <p className="text-sm font-bold">{(typeof notification.title === 'string') ? notification.title : t(notification.title.key, notification.title.options)}</p>
                <p className="text-sm">{(typeof notification.body === 'string') ? notification.body : t(notification.body.key, notification.body.options)}</p>
            </div>
        </div>
    </Link>
}