'use client'

import { useEffect, useState } from "react"
import { CreatorSettings, NotificationOption } from "@/app/api/types"
import { useRouter } from "next/navigation"
import { subscribeToPushNotifications, updateNotificationSettings } from "@/app/api/auth"
import { useTranslations } from 'next-intl';
import styles from "../AccountSidebar.module.css"
import { base64ToArrayBuffer } from 'base64-u8array-arraybuffer'
import { useToken, useUserSettings, useUser } from "@/app/api/hooks/users"
import { Share } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"


export default function NotificationsPage() {
    const [isSupported, setIsSupported] = useState(false)
    const [pushSubscription, setPushSubscription] = useState<PushSubscription | null>(null)
    const { settings, setSettings } = useUserSettings()
    const {user, isLoading} = useUser(true)
    const { token } = useToken()
    const t = useTranslations()
    const router = useRouter()

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

    if(!user && !isLoading) {
        router.push("/signin?redirect=settings/notifications")
        return
    }

    const comment = settings?.settings?.notifications.comment ?? "dashboard_only"
    const reply = settings?.settings?.notifications.reply ?? "dashboard_only"
    const follow = settings?.settings?.notifications.follow ?? "dashboard_only"
    const rating = settings?.settings?.notifications.rating ?? "dashboard_only"
    const translation = settings?.settings?.notifications.translation ?? "dashboard_only"


    const handleUpdate = (type: keyof CreatorSettings['notifications'], value: NotificationOption) => {
        if (!settings?.settings) {
            settings.settings = { notifications: { comment: "dashboard_only", like: "dashboard_only", reply: "dashboard_only", follow: "dashboard_only", rating: "dashboard_only", translation: "dashboard_only" } }
        }

        if (value.includes("push") && isSupported && !pushSubscription) {
            subscribeToPush()
        }

        settings.settings.notifications[type] = value
        updateNotificationSettings(token!, settings.settings.notifications.comment, settings.settings.notifications.like, settings.settings.notifications.reply, settings.settings.notifications.follow, settings.settings.notifications.rating, settings.settings.notifications.translation)
        setSettings(settings)
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
        return <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary"><span>{t(`Account.Notifications.${value}`)}</span></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleUpdate(type, "push_only")}>{t('Account.Notifications.push_only')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdate(type, "push_email_daily")}>{t('Account.Notifications.push_email_daily')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdate(type, "push_email_weekly")}>{t('Account.Notifications.push_email_weekly')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdate(type, "email_daily")}>{t('Account.Notifications.email_daily')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdate(type, "email_weekly")}>{t('Account.Notifications.email_weekly')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdate(type, "dashboard_only")}>{t('Account.Notifications.dashboard_only')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdate(type, "none")}>{t('Account.Notifications.none')}</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
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
                    <Button variant="secondary" onClick={subscribeToPush}><span>{t('Account.Notifications.add_to_this_device')}</span></Button>
                )}
            </div>
        )
    }

    return (
            <div className="flex flex-col gap-4 w-full max-w-100">
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
                        <p>{t('Account.Notifications.follow')}</p>
                    </div>
                    <NotificationOptionDropdown type="follow" value={follow} />
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
    )
}