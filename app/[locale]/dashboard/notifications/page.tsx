"use client"

import { getUser, readAllNotifications, useUserStore } from "@/app/api/auth";
import { getNotifications } from "@/app/api/creators";
import { INotification, IUser } from "@/app/api/types";
import SecondaryButton from "@/components/Buttons/SecondaryButton";
import Notification from "@/components/Dashboard/Notification";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "../dashboard.module.css"

export default function Notifications() {
    const [notifications, setNotifications] = useState<INotification[]>([])
    const user = useUserStore() as IUser
    const setUser = useUserStore((state) => state.setUser)
    const setUserNotifications = useUserStore((state) => state.setNotifications)
    const router = useRouter()
    const t = useTranslations()
    
    if(user._id === "") {
        router.push("/signin")
    }

    useEffect(() => {
        let authorization = localStorage.getItem('jwt') + ""
        getNotifications(authorization, user._id + "").then(setNotifications)

        getUser(authorization).then(user => {
            if(user) {
                setUser(user)
                localStorage.setItem('user', JSON.stringify(user))
            } else {
                localStorage.removeItem('jwt')
                localStorage.removeItem('user')
            }
        })
    }, [])

    const readAll = () => {
        let authorization = localStorage.getItem('jwt') + ""
        setNotifications(notifications.map(notification => ({...notification, read: true})))
        setUserNotifications(notifications.map(notification => ({...notification, read: true})))
        readAllNotifications(authorization)
    }

    return <div className={styles.notifications_page}>
            <h3>{t('notification', {count : 2})}</h3>
            <SecondaryButton className={styles.read_all_button} onClick={readAll}>{t('Account.Notifications.read_all')}</SecondaryButton>
            {notifications.map(notification => <Notification notification={notification} />)}
            {notifications.length === 0 && <p>{t('Account.Notifications.no_notifications')}</p>}
    </div>
}