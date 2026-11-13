"use client"

import { useFollow } from "@/app/api/hooks/users"
import { useTranslations } from "next-intl"
import { Button } from "../button"
import { toast } from "sonner"
import { useRouter } from "@/i18n/navigation"
import { usePathname } from "next/navigation"

export default function SubscribeButton({handle, size}: {handle: string, size?: "default" | "sm" | "icon"}) {
    const { isFollowing, isSelf, signedIn, pending, toggle } = useFollow(handle)
    const router = useRouter()
    const pathname = usePathname()
    const t = useTranslations()

    if(isSelf) return null

    const onClick = async () => {
        if(!signedIn) {
            // Send people back here after they sign in (drop the locale prefix, the router adds it)
            const back = pathname.split("/").slice(2).join("/")
            router.push(`/signin?redirect=${encodeURIComponent(back)}`)
            return
        }
        const wasFollowing = isFollowing
        if(await toggle()) {
            toast.success(t(wasFollowing ? 'Pages.Creator.handle.unfollowed' : 'Pages.Creator.handle.followed', {handle}))
        } else {
            toast.error(t('Pages.Creator.handle.follow_error'))
        }
    }

    return (
        <Button variant={isFollowing ? "secondary" : "default"} size={size} disabled={pending} onClick={onClick}>
            <span>{t(isFollowing ? 'Pages.Creator.handle.unfollow' : 'Pages.Creator.handle.follow')}</span>
        </Button>
    )
}
