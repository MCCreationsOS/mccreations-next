'use client'

import { useUser } from "@/app/api/hooks/users"
import { UserTypes } from "@/app/api/types"
import { Link } from "@/i18n/navigation"
import { Bell, File, Layers, Map, Package } from "lucide-react"
import { useTranslations } from "next-intl"

const linkClass = "flex flex-row gap-2 items-center py-3 md:px-5 px-2 hover:bg-white/20 hover:border-t-white/20 hover:border-b-black/20 border-2 border-transparent"

export default function DashboardNav() {
    const t = useTranslations()
    const {user} = useUser()

    return (
        <nav className="md:max-w-[200px] flex md:flex-col flex-row gap-0 border-2 border-black bg-secondary h-fit flex-wrap">
            <h1 className="text-2xl font-bold m-2">{t('Pages.Dashboard.title')}</h1>
            <Link className={linkClass} href="/dashboard/maps"><Map /> {t('map', {count : 2})}</Link>
            <Link className={linkClass} href="/dashboard/datapacks"><Package /> {t('datapack', {count : 2})}</Link>
            <Link className={linkClass} href="/dashboard/resourcepacks"><Layers /> {t('resourcepack', {count : 2})}</Link>
            {user && <Link className={linkClass} href="/dashboard/notifications"><Bell /> {t('notification', {count : 2})}</Link>}
            {/* The files list is an admin tool */}
            {user?.type === UserTypes.Admin && <Link className={linkClass} href="/dashboard/files"><File /> {t('Pages.Dashboard.Files.title')}</Link>}
        </nav>
    )
}
