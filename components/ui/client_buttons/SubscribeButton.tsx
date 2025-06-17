"use client"

import { useCreator, useToken, useUser } from "@/app/api/hooks/users"
import { follow, unfollow } from "@/app/api/creators"
import { useTranslations } from "next-intl"
import { Button } from "../button"

export default function SubscribeButton({handle}: {handle: string}) {
    const { user } = useUser()
    const { creator } = useCreator(handle)
    const { token, setToken } = useToken()
    const t = useTranslations()

    const handleSubscribe = () => {
        follow(token, handle)
    }

    const handleUnsubscribe = () => {
        unfollow(token, handle)
    }

    if(user?.handle === handle) return null
    if(user?.following?.includes(handle)) return <Button variant="secondary" onClick={handleUnsubscribe}>{t('Profile.unfollow')}</Button>
    return <Button onClick={handleSubscribe}><span>{t('Profile.follow')}</span></Button>
}
