"use client"

import { getUser, readAllNotifications, useUserStore } from "@/app/api/auth";
import { getNotifications } from "@/app/api/creators";
import { INotification, IUser } from "@/app/api/types";
import SecondaryButton from "@/components/Buttons/SecondaryButton";
import Notification from "@/components/Dashboard/Notification";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

import styles from "../dashboard.module.css"
import { useNotifications } from "@/app/api/hooks/notifications";
import { mutate } from "swr";
import PageNavigator from "@/components/Content/Search/Navigator";

export default function Notifications() {
    const page = parseInt(useSearchParams().get("page") ?? "0")
    const user = useUserStore() as IUser
    const {notifications, isLoading, error} = useNotifications(page)
    const setUserNotifications = useUserStore((state) => state.setNotifications)
    const router = useRouter()
    const t = useTranslations()

    
    if(user._id === "") {
        router.push("/signin")
    }

    const readAll = () => {
        let authorization = localStorage?.getItem('jwt') + ""
        mutate(notifications?.map(notification => ({...notification, read: true})) || [])
        setUserNotifications(notifications?.map(notification => ({...notification, read: true})) || [])
        readAllNotifications(authorization)
    }

    return <div className={styles.notifications_page}>
            <h3>{t('notification', {count : 2})}</h3>
            <SecondaryButton className={styles.read_all_button} onClick={readAll}>{t('Account.Notifications.read_all')}</SecondaryButton>
            {notifications?.map(notification => <Notification notification={notification} />)}
            {notifications?.length === 0 && <p>{t('Account.Notifications.no_notifications')}</p>}
            {notifications && notifications.length > 0 && <PageNavigator page={page} pages={Math.ceil(notifications.length / 20.0)} />}
    </div>
}