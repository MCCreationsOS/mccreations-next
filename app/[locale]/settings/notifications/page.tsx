'use client'

import { useEffect, useState } from "react"
import { CreatorSettings, IUser, NotificationOption } from "@/app/api/types"
import { useRouter } from "next/navigation"
import { deleteUser, getUser, subscribeToPushNotifications, updateNotificationSettings, useUserStore } from "@/app/api/auth"
import { useTranslations } from 'next-intl';
import styles from "../AccountSidebar.module.css"
import { DropDownItem } from "@/components/FormInputs/RichText/DropDown"
import { base64ToArrayBuffer } from 'base64-u8array-arraybuffer'
import { useToken, useUser } from "@/app/api/hooks/users"
import dynamic from "next/dynamic";
import { Share } from "react-feather"
import SecondaryButton from "@/components/Buttons/SecondaryButton"

const DropDown = dynamic(() => import("@/components/FormInputs/RichText/DropDown"), { ssr: false })


export default function NotificationsPage() {
    const [isSupported, setIsSupported] = useState(false)
    const [pushSubscription, setPushSubscription] = useState<PushSubscription | null>(null)
    const { user, setUser } = useUser()
    const { token } = useToken()
    const t = useTranslations()

    const comment = user?.settings?.notifications.comment ?? "dashboard_only"
    const reply = user?.settings?.notifications.reply ?? "dashboard_only"
    const subscription = user?.settings?.notifications.subscription ?? "dashboard_only"
    const rating = user?.settings?.notifications.rating ?? "dashboard_only"
    const translation = user?.settings?.notifications.translation ?? "dashboard_only"

    useEffect(() => {
        const getSubscription = async () => {
            const worker = await navigator.serviceWorker.ready
            const sub = await worker?.pushManager.getSubscription()
            if (sub) {
                setPushSubscription(sub)
            }
        }

        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true)
            getSubscription()
        }
    }, [])

    const handleUpdate = (type: keyof CreatorSettings['notifications'], value: NotificationOption) => {
        let settings = user?.settings

        if (!settings) {
            settings = { notifications: { comment: "dashboard_only", like: "dashboard_only", reply: "dashboard_only", subscription: "dashboard_only", rating: "dashboard_only", translation: "dashboard_only" } }
        }

        if (value.includes("push") && isSupported && !pushSubscription) {
            subscribeToPush()
        }

        settings.notifications[type] = value
        setUser({ ...user!, settings })
        updateNotificationSettings(token!, settings.notifications.comment, settings.notifications.like, settings.notifications.reply, settings.notifications.subscription, settings.notifications.rating, settings.notifications.translation)
    }

    async function subscribeToPush() {
        if (pushSubscription) return

        const worker = await navigator.serviceWorker.ready
        const sub = await worker?.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: base64ToArrayBuffer(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
        })
        setPushSubscription(sub)
        subscribeToPushNotifications(token!, sub)
    }

    function NotificationOptionDropdown({ type, value }: { type: keyof CreatorSettings['notifications'], value: NotificationOption }) {
        return <DropDown buttonLabel={t(`Account.Notifications.${value}`)} buttonClassName={`options_dropdown_button ${styles.dropdown_button}`} className={"options_dropdown"}>
            <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => handleUpdate(type, "push_only")}>{t('Account.Notifications.push_only')}</DropDownItem>
            <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => handleUpdate(type, "push_email_daily")}>{t('Account.Notifications.push_email_daily')}</DropDownItem>
            <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => handleUpdate(type, "push_email_weekly")}>{t('Account.Notifications.push_email_weekly')}</DropDownItem>
            <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => handleUpdate(type, "email_daily")}>{t('Account.Notifications.email_daily')}</DropDownItem>
            <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => handleUpdate(type, "email_weekly")}>{t('Account.Notifications.email_weekly')}</DropDownItem>
            <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => handleUpdate(type, "dashboard_only")}>{t('Account.Notifications.dashboard_only')}</DropDownItem>
            <DropDownItem className={`option_button ${styles.dropdown_item}`} onClick={() => handleUpdate(type, "none")}>{t('Account.Notifications.none')}</DropDownItem>
        </DropDown>
    }

    const InstallPrompt = () => {
        const [isIOS, setIsIOS] = useState(false)
        const [isStandalone, setIsStandalone] = useState(false)

        useEffect(() => {
            setIsIOS(
                /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
            )

            setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
        }, [])

        if (isStandalone) {
            return null // Don't show install button if already installed
        }

        return (
            <div>
                {isIOS && (
                    <p>
                        {t.rich('Account.Notifications.install_ios_instructions', {icon: (chunks) => <span role="img" aria-label="share icon">
                            {' '}
                            <Share />{' '}
                        </span>})}
                    </p>
                )}
                {!isIOS && !pushSubscription && (
                    <SecondaryButton onClick={subscribeToPush}>{t('Account.Notifications.add_to_this_device')}</SecondaryButton>
                )}
            </div>
        )
    }

    return (
        <div className="popup_page">
            <div className={styles.account_content}>
                <h2>{t('Account.Notifications.title')}</h2>
                <div className="settings_option">
                    <div className="text">
                        <p>{t('Account.Notifications.comment')}</p>
                    </div>
                    <NotificationOptionDropdown type="comment" value={comment} />
                </div>
                <div className="settings_option">
                    <div className="text">
                        <p>{t('Account.Notifications.reply')}</p>
                    </div>
                    <NotificationOptionDropdown type="reply" value={reply} />
                </div>
                <div className="settings_option">
                    <div className="text">
                        <p>{t('Account.Notifications.subscription')}</p>
                    </div>
                    <NotificationOptionDropdown type="subscription" value={subscription} />
                </div>
                <div className="settings_option">
                    <div className="text">
                        <p>{t('Account.Notifications.rating')}</p>
                    </div>
                    <NotificationOptionDropdown type="rating" value={rating} />
                </div>
                <div className="settings_option">
                    <div className="text">
                        <p>{t('Account.Notifications.translation')}</p>
                    </div>
                    <NotificationOptionDropdown type="translation" value={translation} />
                </div>
                <InstallPrompt />
            </div>
        </div>
    )
}