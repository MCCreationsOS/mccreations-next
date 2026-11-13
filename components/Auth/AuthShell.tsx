'use client'

import { useCreations } from "@/app/api/hooks/creations";
import { useUser } from "@/app/api/hooks/users";
import { OAuthProvider, startOAuth } from "@/app/api/oauth";
import { SortOptions } from "@/app/api/types";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

function AuthBackground() {
    const t = useTranslations()
    const {creations} = useCreations({status: 2, contentType: "content", limit: 20, page: 0, sort: SortOptions.HighestDownloads})
    const [index, setIndex] = useState(0)

    useEffect(() => {
        if (creations.length === 0) return
        const interval = setInterval(() => {
            setIndex((current) => (current + 1) % creations.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [creations.length])

    return (
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            {creations.map((creation, i) => (
                <div key={creation._id ?? i} className={`absolute inset-0 ${index === i ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                    <Image src={creation.images && creation.images.length > 0 ? creation.images[0] : '/defaultBanner.png'} alt="" fill sizes="100vw" className="object-cover blur-sm" />
                    <div className="absolute bottom-0 left-0 bg-black/50 p-4 hidden md:block">
                        <p className="text-white text-xl font-bold">{creation.title}</p>
                        <p className="text-sm">{t('Pages.SignIn.by', {creators: creation.creators.map((creator) => creator.username).join(", ")})}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

const PROVIDERS: {id: OAuthProvider, icon: string}[] = [
    {id: "google", icon: "/icons/google.png"},
    {id: "discord", icon: "/icons/discord.svg"},
    {id: "github", icon: "/icons/github.svg"},
]

export function OAuthButtons({redirect}: {redirect?: string}) {
    const t = useTranslations()
    const {user} = useUser()
    // A signed-in user going through a provider links it to their account instead
    const mode = user ? "link" : "signin"

    return (
        <div className="flex flex-row flex-wrap gap-2 mb-5">
            {PROVIDERS.map((provider) => (
                <Button key={provider.id} type="button" variant="secondary" className="bg-white/10 py-3 px-6 hover:bg-white/20" onClick={() => startOAuth(provider.id, mode, redirect)}>
                    <Image src={provider.icon} alt="" width={20} height={20} /> <span>{t(`Pages.SignIn.Providers.${provider.id}`)}</span>
                </Button>
            ))}
        </div>
    )
}

export default function AuthShell({children}: {children: React.ReactNode}) {
    return (
        <div className="relative min-h-[700px] flex items-start justify-center px-4 py-10">
            <AuthBackground />
            <div className="relative z-10 w-full max-w-xl bg-secondary p-6 md:p-10 border-2 border-black">
                {children}
            </div>
        </div>
    )
}
