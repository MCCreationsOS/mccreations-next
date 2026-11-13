'use client'

import { useEffect, useState } from "react"
import { CreatorSettings, NotificationOption } from "@/app/api/types"
import { useRouter } from "@/i18n/navigation"
import { subscribeToPushNotifications, updateNotificationSettings } from "@/app/api/auth"
import { useTranslations } from 'next-intl';
import { base64ToArrayBuffer } from 'base64-u8array-arraybuffer'
import { useToken, useUserSettings, useUser } from "@/app/api/hooks/users"
import { Share } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type NotificationType = keyof CreatorSettings['notifications']

const DEFAULT_NOTIFICATIONS: CreatorSettings['notifications'] = { comment: "dashboard_only", like: "dashboard_only", reply: "dashboard_only", follow: "dashboard_only", rating: "dashboard_only", translation: "dashboard_only" }
const VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const ALL_OPTIONS: NotificationOption[] = ["push_only", "push_email_daily", "push_email_weekly", "email_daily", "email_weekly", "dashboard_only", "none"]

function InstallPrompt({ canSubscribe, onSubscribe }: { canSubscribe: boolean, onSubscribe: () => void }) {
    const t = useTranslations()
    const [isIOS, setIsIOS] = useState(false)
    const [isStandalone, setIsStandalone] = useState(false)

    useEffect(() => {
        setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream)
        setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
    }, [])

    if (isStandalone) return null

    return (
        <div>
            {isIOS && (
                <p>
                    {t.rich('Pages.Settings.Notifications.install_ios_instructions', {icon: () => <span role="img" aria-label="share icon">
                        {' '}
                        <Share />{' '}
                    </span>})}
                </p>
            )}
            {!isIOS && canSubscribe && (
                <Button variant="secondary" onClick={onSubscribe}><span>{t('Pages.Settings.Notifications.add_to_this_device')}</span></Button>
            )}
        </div>
    )
}

export default function NotificationsPage() {
    const [isSupported, setIsSupported] = useState(false)
    const [pushSubscription, setPushSubscription] = useState<PushSubscription | null>(null)
    const { settings, setSettings } = useUserSettings()
    const {user, isLoading} = useUser(true)
    const { token } = useToken()
    const t = useTranslations()
    const router = useRouter()

    const pushAvailable = isSupported && !!VAPID_KEY

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true)
            navigator.serviceWorker.ready
                .then((worker) => worker.pushManager.getSubscription())
                .then((sub) => sub && setPushSubscription(sub))
                .catch(() => {})
        }
    }, [])

    useEffect(() => {
        if(!user && !isLoading) {
            router.push("/signin?redirect=settings/notifications")
        }
    }, [user, isLoading, router])

    if(!user) return null

    const notifications = { ...DEFAULT_NOTIFICATIONS, ...settings?.settings?.notifications }

    async function subscribeToPush() {
        if (pushSubscription || !pushAvailable) return true
        try {
            const worker = await navigator.serviceWorker.ready
            const sub = await worker.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: base64ToArrayBuffer(VAPID_KEY!)
            })
            setPushSubscription(sub)
            const result = await subscribeToPushNotifications(token, sub)
            if (!result.ok) throw new Error(result.error)
            return true
        } catch (e) {
            console.error(e)
            toast.error(t('Pages.Settings.Notifications.push_error'))
            return false
        }
    }

    const handleUpdate = async (type: NotificationType, value: NotificationOption) => {
        if (value.includes("push") && !(await subscribeToPush())) return

        const updated = { ...notifications, [type]: value }
        const result = await updateNotificationSettings(token, updated.comment, updated.like, updated.reply, updated.follow, updated.rating, updated.translation)
        if (!result.ok) {
            toast.error(t('Pages.Settings.Notifications.save_error'))
            return
        }
        setSettings({ ...settings, settings: { ...settings?.settings, notifications: updated } })
        toast.success(t('Pages.Settings.Notifications.saved'))
    }

    const options = ALL_OPTIONS.filter((option) => pushAvailable || !option.includes("push"))

    const row = (type: NotificationType, label: string) => (
        <div className="flex flex-row gap-4 items-center justify-between">
            <p>{label}</p>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary"><span>{t(`Pages.Settings.Notifications.${notifications[type]}`)}</span></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {options.map((option) => (
                        <DropdownMenuItem key={option} onSelect={() => handleUpdate(type, option)}>{t(`Pages.Settings.Notifications.${option}`)}</DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )

    return (
        <div className="flex flex-col gap-4 w-full max-w-100">
            <h2>{t('Pages.Settings.Notifications.title')}</h2>
            {row("comment", t('Pages.Settings.Notifications.comment'))}
            {row("reply", t('Pages.Settings.Notifications.reply'))}
            {row("follow", t('Pages.Settings.Notifications.follow'))}
            {row("rating", t('Pages.Settings.Notifications.rating'))}
            {row("translation", t('Pages.Settings.Notifications.translation'))}
            {pushAvailable && <InstallPrompt canSubscribe={!pushSubscription} onSubscribe={subscribeToPush} />}
        </div>
    )
}
