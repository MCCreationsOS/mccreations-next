import { getTranslations } from "next-intl/server"
import Link from "next/link"

import styles from "./dashboard.module.css"
import { Bell, Layers, Map, Package } from "react-feather"

export default async function Layout({params: {locale}, children}: {params: {locale: string}, children: React.ReactElement}) {
    const t = await getTranslations()
    
    return (
        <div className={styles.dashboard_page}>
            <div className={styles.dashboard_layout}>
                <nav className={styles.dashboard_sidebar}>
                    <h1>{t('Dashboard.title')}</h1>
                    <Link className={styles.dashboard_sidebar_item} href="/dashboard/maps"><Map /> {t('map', {count : 2})}</Link>
                    <Link className={styles.dashboard_sidebar_item} href="/dashboard/datapacks"><Package /> {t('datapack', {count : 2})}</Link>
                    <Link className={styles.dashboard_sidebar_item} href="/dashboard/resourcepacks"><Layers /> {t('resourcepack', {count : 2})}</Link>
                    <Link className={styles.dashboard_sidebar_item} href="/dashboard/notifications"><Bell /> {t('notification', {count : 2})}</Link>
                </nav>
                <div className={styles.dashboard_content}>{children}</div>
            </div>
        </div>
    )
}