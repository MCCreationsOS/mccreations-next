'use client'

import { Edit, Globe, Image, Server } from "react-feather";
import EditHeader from "./editHeader";
import { Link, usePathname } from "@/app/api/navigation";
import styles from "./edit.module.css"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useTranslations } from "next-intl";
import { ContentTypes } from "@/app/api/types";

export default function EditMenu({params}: {params: Params}) {
    const contentType = (params.contentType.endsWith("s") ? params.contentType.substring(0, params.contentType.length-1) : params.contentType) as ContentTypes
    const t = useTranslations()
    const path = usePathname()

    return <nav className={styles.dashboard_sidebar}>
        <EditHeader slug={params.slug} contentType={contentType} />
        <Link className={styles.dashboard_sidebar_item + (path === `/edit/${params.contentType}/${params.slug}/general` || path === `/edit/${params.contentType}/${params.slug}` ? " " + styles.active : "")} href={`/edit/${params.contentType}/${params.slug}/general`}><Edit /> {t('Content.Edit.general')}</Link>
        <Link className={styles.dashboard_sidebar_item + (path === `/edit/${params.contentType}/${params.slug}/images` ? " " + styles.active : "")} href={`/edit/${params.contentType}/${params.slug}/images`}><Image /> {t('Content.Edit.images')}</Link>
        <Link className={styles.dashboard_sidebar_item + (path === `/edit/${params.contentType}/${params.slug}/versions` ? " " + styles.active : "")} href={`/edit/${params.contentType}/${params.slug}/versions`}><Server /> {t('Content.Edit.versions')}</Link>
        <Link className={styles.dashboard_sidebar_item + (path === `/edit/${params.contentType}/${params.slug}/translations` ? " " + styles.active : "")} href={`/edit/${params.contentType}/${params.slug}/translations`}><Globe /> {t('Content.Edit.translations')}</Link>
    </nav>
}