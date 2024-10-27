"use client"

import { useCreator, useToken, useUser } from "@/app/api/hooks/users"
import SecondaryButton from "./SecondaryButton"
import { subscribe, unsubscribe } from "@/app/api/creators"
import MainButton from "./MainButton"

export default function SubscribeButton({handle}: {handle: string}) {
    const { user } = useUser()
    const { creator } = useCreator(handle)
    const { token, setToken } = useToken()

    const handleSubscribe = () => {
        subscribe(token, handle)
    }

    const handleUnsubscribe = () => {
        unsubscribe(token, handle)
    }

    if(user?.handle === handle) return null
    if(user?.subscriptions?.includes(handle)) return <SecondaryButton onClick={handleUnsubscribe}>Unsubscribe</SecondaryButton>
    return <MainButton onClick={handleSubscribe}>Subscribe</MainButton>
}
