"use client"

import { readAllNotifications } from "@/app/api/auth";
import SecondaryButton from "@/components/Buttons/SecondaryButton";
import Notification from "@/components/Dashboard/Notification";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

import styles from "../dashboard.module.css"
import { useNotifications } from "@/app/api/hooks/notifications";
import { mutate } from "swr";
import PageNavigator from "@/components/Content/Search/Navigator";
import { useUser, useToken } from "@/app/api/hooks/users";
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

    return <div className={styles.notifications_page}>
            <h3>{t('notification', {count : 2})}</h3>
            <SecondaryButton className={styles.read_all_button} onClick={readAll}>{t('Account.Notifications.read_all')}</SecondaryButton>
            {notifications?.map(notification => <Notification notification={notification} />)}
            {notifications?.length === 0 && <p>{t('Account.Notifications.no_notifications')}</p>}
            {notifications && notifications.length > 0 && <PageNavigator page={page} pages={Math.ceil(total ?? 0 / 20.0)} />}
    </div>
}