'use client'

import { useEffect, useState } from "react"
import { IUser, NotificationOption } from "@/app/api/types"
import { useRouter } from "next/navigation"
import { deleteUser, getUser, subscribeToPushNotifications, updateNotificationSettings, useUserStore } from "@/app/api/auth"
import {useTranslations} from 'next-intl';
import styles from "../AccountSidebar.module.css"
import DropDown, { DropDownItem } from "@/components/FormInputs/RichText/DropDown"
import { base64ToArrayBuffer } from 'base64-u8array-arraybuffer'

export default function NotificationsPage() {
    const [comment, setComment] = useState<NotificationOption>()
    const [like, setLike] = useState<NotificationOption>()
    const [reply, setReply] = useState<NotificationOption>()
    const [subscription, setSubscription] = useState<NotificationOption>()
    const [rating, setRating] = useState<NotificationOption>()
    const [translation, setTranslation] = useState<NotificationOption>()
    const [isSupported, setIsSupported] = useState(false)
    const [pushSubscription, setPushSubscription] = useState<PushSubscription | null>(null)
    const user = useUserStore() as IUser
    const setUser = useUserStore((state) => state.setUser)
    const setSettings = useUserStore((state) => state.setSettings)
    const router = useRouter();
    const t = useTranslations()
    let token: string | null;

    useEffect(() => {
        token = localStorage.getItem('jwt')
        if(!user._id) {
            console.log("Reading from local storage")
            const storedUser = localStorage.getItem('user')
            if(storedUser) {
                let user = JSON.parse(storedUser) as IUser
                setUser(user)
                console.log(user.settings?.notifications)
                if(user.settings?.notifications) {
                    setComment(user.settings.notifications.comment ?? "dashboard_only")
                    setLike(user.settings.notifications.like ?? "dashboard_only")
                    setReply(user.settings.notifications.reply ?? "dashboard_only")
                    setSubscription(user.settings.notifications.subscription ?? "dashboard_only")
                    setRating(user.settings.notifications.rating ?? "dashboard_only")
                    setTranslation(user.settings.notifications.translation ?? "dashboard_only")
                } else {
                    setComment("dashboard_only")
                    setLike("dashboard_only")
                    setReply("dashboard_only")
                    setSubscription("dashboard_only")
                    setRating("dashboard_only")
                    setTranslation("dashboard_only")
                }
            } else {
                getUser(localStorage.getItem('jwt') + "").then((user) => {
                    if(user) {
                        setUser(user)
                        localStorage.setItem('user', JSON.stringify(user))

                        if(user.settings?.notifications) {
                            setComment(user.settings.notifications.comment ?? "dashboard_only")
                            setLike(user.settings.notifications.like ?? "dashboard_only")
                            setReply(user.settings.notifications.reply ?? "dashboard_only")
                            setSubscription(user.settings.notifications.subscription ?? "dashboard_only")
                            setRating(user.settings.notifications.rating ?? "dashboard_only")
                            setTranslation(user.settings.notifications.translation ?? "dashboard_only")
                        } else {
                            setComment("dashboard_only")
                            setLike("dashboard_only")
                            setReply("dashboard_only")
                            setSubscription("dashboard_only")
                            setRating("dashboard_only")
                            setTranslation("dashboard_only")
                        }
                    } else {
                        localStorage.removeItem('jwt')
                        localStorage.removeItem('user')
                    }
                })
            }
        }

        const getSubscription = async () => {
            const worker = await navigator.serviceWorker.ready
            const sub = await worker?.pushManager.getSubscription()
            if(sub) {
                setPushSubscription(sub)
            }
        }

        if('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true)
            getSubscription()
        }

    }, [])

    useEffect(() => {
        if(!comment || !like || !reply || !subscription || !rating || !translation) return
        token = localStorage.getItem('jwt')
        updateNotificationSettings(token!, comment, like, reply, subscription, rating, translation)

        console.log(comment, like, reply, subscription, rating, translation)

        setSettings({
            notifications: {
                comment: comment,
                like: like,
                reply: reply,
                subscription: subscription,
                rating: rating,
                translation: translation
            }
        })

        if(comment+like+reply+subscription+rating+translation.includes("push") && isSupported) {
            subscribeToPush()
        }

        localStorage.setItem('user', JSON.stringify({...user, settings: {notifications: {comment: comment, like: like, reply: reply, subscription: subscription, rating: rating, translation: translation}}}))
    }, [comment, like, reply, subscription, rating, translation])

    async function subscribeToPush() {
        if(pushSubscription) return
        
        const worker = await navigator.serviceWorker.ready
        const sub = await worker?.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: base64ToArrayBuffer(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
        })
        setPushSubscription(sub)
        subscribeToPushNotifications(token!, sub)
    }

    return (
        <div className="popup_page">
            <div className={styles.account_content}>
                <h2>{t('Account.Notifications.title')}</h2>
                <div className="settings_option">
                    <div className="text">
                        <p>{t('Account.Notifications.comment')}</p>
                    </div>
                    <DropDown buttonLabel={t(`Account.Notifications.${comment ?? "dashboard_only"}`)} buttonClassName={`options_dropdown_button ${styles.dropdown_button}`} className={"options_dropdown"}>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setComment("push_only")}>{t('Account.Notifications.push_only')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setComment("push_email_daily")}>{t('Account.Notifications.push_email_daily')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setComment("push_email_weekly")}>{t('Account.Notifications.push_email_weekly')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setComment("email_daily")}>{t('Account.Notifications.email_daily')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setComment("email_weekly")}>{t('Account.Notifications.email_weekly')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setComment("dashboard_only")}>{t('Account.Notifications.dashboard_only')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setComment("none")}>{t('Account.Notifications.none')}</DropDownItem>
                    </DropDown>
                </div>
                <div className="settings_option">
                    <div className="text">
                        <p>{t('Account.Notifications.reply')}</p>
                    </div>
                    <DropDown buttonLabel={t(`Account.Notifications.${reply ?? "dashboard_only"}`)} buttonClassName={`options_dropdown_button ${styles.dropdown_button}`} className={"options_dropdown"}>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setReply("push_only")}>{t('Account.Notifications.push_only')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setReply("push_email_daily")}>{t('Account.Notifications.push_email_daily')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setReply("push_email_weekly")}>{t('Account.Notifications.push_email_weekly')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setReply("email_daily")}>{t('Account.Notifications.email_daily')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setReply("email_weekly")}>{t('Account.Notifications.email_weekly')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setReply("dashboard_only")}>{t('Account.Notifications.dashboard_only')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setReply("none")}>{t('Account.Notifications.none')}</DropDownItem>
                    </DropDown>
                </div>
                <div className="settings_option">
                    <div className="text">
                        <p>{t('Account.Notifications.subscription')}</p>   
                    </div>
                    <DropDown buttonLabel={t(`Account.Notifications.${subscription ?? "dashboard_only"}`)} buttonClassName={`options_dropdown_button ${styles.dropdown_button}`} className={"options_dropdown"}>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setSubscription("push_only")}>{t('Account.Notifications.push_only')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setSubscription("push_email_daily")}>{t('Account.Notifications.push_email_daily')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setSubscription("push_email_weekly")}>{t('Account.Notifications.push_email_weekly')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setSubscription("email_daily")}>{t('Account.Notifications.email_daily')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setSubscription("email_weekly")}>{t('Account.Notifications.email_weekly')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setSubscription("dashboard_only")}>{t('Account.Notifications.dashboard_only')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setSubscription("none")}>{t('Account.Notifications.none')}</DropDownItem>
                    </DropDown>
                </div>
                <div className="settings_option">
                    <div className="text">
                        <p>{t('Account.Notifications.rating')}</p>   
                    </div>
                    <DropDown buttonLabel={t(`Account.Notifications.${rating ?? "dashboard_only"}`)} buttonClassName={`options_dropdown_button ${styles.dropdown_button}`} className={"options_dropdown"}>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setRating("push_only")}>{t('Account.Notifications.push_only')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setRating("push_email_daily")}>{t('Account.Notifications.push_email_daily')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setRating("push_email_weekly")}>{t('Account.Notifications.push_email_weekly')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setRating("email_daily")}>{t('Account.Notifications.email_daily')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setRating("email_weekly")}>{t('Account.Notifications.email_weekly')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setRating("dashboard_only")}>{t('Account.Notifications.dashboard_only')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setRating("none")}>{t('Account.Notifications.none')}</DropDownItem>
                    </DropDown>
                </div>
                <div className="settings_option">
                    <div className="text">
                        <p>{t('Account.Notifications.translation')}</p>   
                    </div>
                    <DropDown buttonLabel={t(`Account.Notifications.${translation ?? "dashboard_only"}`)} buttonClassName={`options_dropdown_button ${styles.dropdown_button}`} className={"options_dropdown"}>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setTranslation("push_only")}>{t('Account.Notifications.push_only')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setTranslation("push_email_daily")}>{t('Account.Notifications.push_email_daily')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setTranslation("push_email_weekly")}>{t('Account.Notifications.push_email_weekly')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setTranslation("email_daily")}>{t('Account.Notifications.email_daily')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setTranslation("email_weekly")}>{t('Account.Notifications.email_weekly')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setTranslation("dashboard_only")}>{t('Account.Notifications.dashboard_only')}</DropDownItem>
                        <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => setTranslation("none")}>{t('Account.Notifications.none')}</DropDownItem>
                    </DropDown>
                </div>
            </div>
        </div>
    )
}