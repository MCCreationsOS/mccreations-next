'use client'

import { convertToCollection, downloadMap, fetchMap, fetchResourcepack } from "@/app/api/content";
import { ContentTypes, IContentDoc, IFile } from "@/app/api/types";
import DownloadButton from "@/components/Buttons/DownloadButton";
import IconButton from "@/components/Buttons/IconButton";
import ContentMenu from "@/components/Content/ContentMenu";
import ContentWarnings from "@/components/Content/ContentWarnings";
import Rating from "@/components/Rating";
import { useI18n } from "@/locales/client";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Archive, Layers, Package, Server } from "react-feather";
import styles from './table.module.css'

export default function Page({ params }: { params: Params }) {
    const [content, setContent] = useState<IContentDoc | null>(null)
    const t = useI18n();

    useEffect(() => {
        fetchResourcepack(params.slug).then(setContent)
    }, [])

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
        await downloadMap(content!.slug)
        let a = document.createElement('a')
        a.href = url
        a.download = url.split('/').pop()!
        a.target = '_blank'
        a.click()
        a.remove()
    }

    if (!content) return <div className="centered_content">Loading...</div>

    return (
        <>
            <ContentWarnings map={content} />
            <ContentMenu content={content} selectedTab={1} />
            <div className='map_page'>
                <div className="centered_content">
                    <div className='map_title_bar'>
                        <div className="map_title_stack">
                            <h1 className='map_title'>{content.title}</h1>
                        </div>
                        <div className='map_download_stack'>
                            <Rating value={content.rating} content={content} />
                            {(content.files) ? <DownloadButton slug={content.slug} file={content.files[0]} /> : <></>}
                            <Link title={t(`content.affiliates.server.${"Maps"}`)} href="https://www.minecraft-hosting.pro/?affiliate=468862"><IconButton><Server /></IconButton></Link>
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
                    {content.files && content.files.map((file: IFile, idx) => (
                        <div className={styles.content_item} key={idx}>
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
                                            return <IconButton key={idx} onClick={() => { download(extraFile.url) }}>{(extraFile.type === "map") ? <Archive /> : (extraFile.type === 'resourcepack') ? <Layers /> : <Package />}</IconButton>
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