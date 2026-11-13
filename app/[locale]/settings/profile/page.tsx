"use client"

import { useUser } from "@/app/api/hooks/users"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { useEffect } from "react"

export default function ProfilePage() {
    const {user, isLoading} = useUser()
    const router = useRouter()
    const t = useTranslations()

    useEffect(() => {
        if(isLoading) return
        if(user?.handle) {
            router.replace(`/creator/${user.handle}`)
        } else {
            router.replace("/signin?redirect=settings/profile")
        }
    }, [user, isLoading, router])

    return <div className="centered_content">{t('Pages.Settings.Account.loading')}</div>
}
