"use client"

import { getUser, readAllNotifications, useUserStore } from "@/app/api/auth";
import { getNotifications } from "@/app/api/creators";
import { INotification, IUser } from "@/app/api/types";
import SecondaryButton from "@/components/Buttons/SecondaryButton";
import Notification from "@/components/Dashboard/Notification";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import styles from "../dashboard.module.css"
import { useNotifications } from "@/app/api/hooks/notifications";
import { mutate } from "swr";

export default function Notifications() {
    const user = useUserStore() as IUser
    const {notifications, isLoading, error} = useNotifications(user._id + "")
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
    </div>
}