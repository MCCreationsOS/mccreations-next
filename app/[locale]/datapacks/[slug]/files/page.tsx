'use client'

import { downloadCreation } from "@/app/api/content";
import { ContentTypes, IFile } from "@/app/api/types";
import DownloadButton from "@/components/Buttons/DownloadButton";
import IconButton from "@/components/Buttons/IconButton";
import ContentMenu from "@/components/Content/ContentMenu";
import ContentWarnings from "@/components/Content/ContentWarnings";
import Rating from "@/components/Rating";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import Link from "next/link";
import { Archive, Layers, Package, Server } from "react-feather";
import styles from './table.module.css'
import { useLocale, useTranslations } from "next-intl";
import { useCreation } from "@/app/api/hooks/creations";

export default function Page({ params }: { params: Params }) {
    const { creation, isLoading, error } = useCreation(params.slug, ContentTypes.Datapacks)
    const t = useTranslations();
    const locale = useLocale()

    if(error || 'error' in creation) return <div className="centered_content">{t('Content.Files.loading')}</div>

    const formatFileURL = (file: IFile) => {
        let url = ""

        if (file.url) url = file.url.substring(file.url.lastIndexOf("/") + 1)
        else if (file.worldUrl) url = file.worldUrl.substring(file.worldUrl.lastIndexOf("/") + 1)
        else if (file.dataUrl) url = file.dataUrl.substring(file.dataUrl.lastIndexOf("/") + 1)
        else if (file.resourceUrl) url = file.resourceUrl.substring(file.resourceUrl.lastIndexOf("/") + 1)

        url = decodeURI(url)

        return url
    }

    const download = async (url: string) => {
        await downloadCreation(creation!.slug, creation!.type)
        let a = document.createElement('a')
        a.href = url
        a.download = url.split('/').pop()!
        a.target = '_blank'
        a.click()
        a.remove()
    }

    
    if (!creation) return <div className="centered_content">{t('Content.Files.loading')}</div>

    let title = creation.title
    
    if(creation.translations && creation.translations[locale] && creation.translations[locale].approved) {
        title = creation.translations[locale].title
    }
    
    return (
        <>
            <ContentWarnings map={creation} />
            <ContentMenu content={creation} selectedTab={1} />
            <div className='map_page'>
                <div className="centered_content">
                    <div className='map_title_bar'>
                        <div className="map_title_stack">
                            <h1 className='map_title'>{title}</h1>
                        </div>
                        <div className='map_download_stack'>
                            <Rating value={creation.rating} content={creation} />
                            {(creation.files) ? <DownloadButton contentType={creation.type} slug={creation.slug} file={creation.files[0]} /> : <></>}
                            <Link className="affiliate_button" title={t(`Content.affiliate`, {type: t('datapack', {count: 1})})} href="https://www.minecraft-hosting.pro/?affiliate=468862"><IconButton><Server /></IconButton></Link>
                        </div>
                    </div>
                    <div className={styles.content_item}>
                        <div className={styles.content_item_item}>
                            <p>{t('Content.Files.name')}</p>
                        </div>
                        <div className={styles.content_item_item}>
                            <p>{t('Content.Files.date')}</p>
                        </div>
                        <div className={styles.content_item_item}>
                            <p>{t('Content.Files.minecraft_version')}</p>
                        </div>
                        <div className={styles.content_item_item}>
                            <p>{t('Content.Files.download')}</p>
                        </div>
                    </div>
                    {creation.files && creation.files.map((file: IFile) => (
                        <div className={styles.content_item} key={file.createdDate}>
                            <div className={styles.content_item_item}>
                                <p>{file.contentVersion || formatFileURL(file)}</p>
                            </div>
                            <div className={styles.content_item_item}>
                                <p>{file.createdDate && new Date(file.createdDate).toLocaleDateString()}</p>
                            </div>
                            <div className={styles.content_item_item}>
                                <p>{file.minecraftVersion}</p>
                            </div>
                            <div className={styles.content_item_item}>
                                {(file.url) ? <>
                                        <IconButton onClick={() => { download(file.url!) }}>{(file.type === "map") ? <Archive /> : (file.type === 'resourcepack') ? <Layers /> : <Package />} </IconButton>
                                        {file.extraFiles && file.extraFiles.map((extraFile, idx) => {
                                            if (idx > 2) return <></>
                                            return <IconButton key={file.createdDate} onClick={() => { download(extraFile.url) }}>{(extraFile.type === "map") ? <Archive /> : (extraFile.type === 'resourcepack') ? <Layers /> : <Package />}</IconButton>
                                        })}
                                    </> :
                                    <>
                                        <div className={styles.download_options}>
                                            {(file.worldUrl) ? <IconButton onClick={() => { download(file.worldUrl!) }}><Archive /></IconButton> : <></>}
                                            {(file.dataUrl) ? <IconButton onClick={() => { download(file.dataUrl!) }}><Package /></IconButton> : <></>}
                                            {(file.resourceUrl) ? <IconButton onClick={() => { download(file.resourceUrl!) }}><Layers /></IconButton> : <></>}
                                        </div>
                                        </>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}