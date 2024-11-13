"use client"

import { useCreator, useToken, useUser } from "@/app/api/hooks/users"
import SecondaryButton from "./SecondaryButton"
import { subscribe, unsubscribe } from "@/app/api/creators"
import MainButton from "./MainButton"
import { useTranslations } from "next-intl"

export default function SubscribeButton({handle}: {handle: string}) {
    const { user } = useUser()
    const { creator } = useCreator(handle)
    const { token, setToken } = useToken()
    const t = useTranslations()

    const handleSubscribe = () => {
        subscribe(token, handle)
    }

    const handleUnsubscribe = () => {
        unsubscribe(token, handle)
    }

    if(user?.handle === handle) return null
    if(user?.following?.includes(handle)) return <SecondaryButton onClick={handleUnsubscribe}>{t('Profile.unfollow')}</SecondaryButton>
    return <MainButton onClick={handleSubscribe}>{t('Profile.follow')}</MainButton>
}
