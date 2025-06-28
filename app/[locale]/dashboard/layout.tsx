import { getTranslations } from "next-intl/server"
import Link from "next/link"

import styles from "./dashboard.module.css"
import { Bell, Layers, Map, Package } from "lucide-react"

export default async function Layout({params: {locale}, children}: {params: {locale: string}, children: React.ReactElement}) {
    const t = await getTranslations()
    
    return (
        <div className="m-2 flex flex-col md:flex-row gap-10">
            <nav className="md:max-w-[200px] flex md:flex-col flex-row gap-0 border-2 border-black bg-secondary h-fit flex-wrap">
                <h1 className="text-2xl font-bold m-2">{t('Dashboard.title')}</h1>
                <Link className="flex flex-row gap-2 items-center py-3 md:px-5 px-2 hover:bg-white/20 hover:border-t-white/20 hover:border-b-black/20 border-2 border-transparent" href="/dashboard/maps"><Map /> {t('map', {count : 2})}</Link>
                <Link className="flex flex-row gap-2 items-center py-3 md:px-5 px-2 hover:bg-white/20 hover:border-t-white/20 hover:border-b-black/20 border-2 border-transparent" href="/dashboard/datapacks"><Package /> {t('datapack', {count : 2})}</Link>
                <Link className="flex flex-row gap-2 items-center py-3 md:px-5 px-2 hover:bg-white/20 hover:border-t-white/20 hover:border-b-black/20 border-2 border-transparent" href="/dashboard/resourcepacks"><Layers /> {t('resourcepack', {count : 2})}</Link>
                <Link className="flex flex-row gap-2 items-center py-3 md:px-5 px-2 hover:bg-white/20 hover:border-t-white/20 hover:border-b-black/20 border-2 border-transparent" href="/dashboard/notifications"><Bell /> {t('notification', {count : 2})}</Link>
            </nav>
            <div className={styles.dashboard_content}>{children}</div>
        </div>
    )
}