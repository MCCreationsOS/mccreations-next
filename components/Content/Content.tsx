'use client'
import { ICreator, IFile, IContentDoc, CollectionNames, Locales } from "@/app/api/types";
import Image from 'next/image'
import Rating from "../Rating";
import CreatorCard from "../Creator/CreatorCard";
import FileCard from "../File/FileCard";
import MapImageSlideshow from "../MapImageSlideshow/MapImageSlideshow";
import CommentForm from "../Comment/ComentForm";
import CommentsList from "@/components/Comment/CommentsList";
import DOMPurify from "isomorphic-dompurify";
import ContentMenu from "./ContentMenu";
import IconButton from "../Buttons/IconButton";
import { Server } from "react-feather";
import { Link } from "@/app/api/navigation";
import {useLocale, useTranslations} from 'next-intl';
import DownloadButton from "../Buttons/DownloadButton";
import CreateTranslationForm from "../CreateTranslationForm";
import { Suspense } from "react";
import { convertToType } from "@/app/api/content";
import { AdsenseComponent } from "../AdUnits/InContent";
import styles from './Content.module.css'
import { makeSentenceCase } from "@/app/api/utils";

export const dynamic = 'force-dynamic'

/**
 * The map component represents all the information displayed on a map page
 * @param map The map to display
 * @param privileged If the user is privileged to see the content
 */
export default function Content({content, collectionName}: {content: IContentDoc, collectionName: CollectionNames}) {
    const t = useTranslations()
    const locale = useLocale();
    const contentType = convertToType(collectionName);

    let title = content.title
    let description = content.description
    
    if(content.translations && content.translations[locale] && content.translations[locale].approved) {
        title = content.translations[locale].title
        description = content.translations[locale].description
    }

    let videoID = ""
    if(content.videoUrl && content.videoUrl.includes("?v=")) {
        videoID = content.videoUrl.substring(content.videoUrl.indexOf("?v=") + 3, (content.videoUrl.lastIndexOf("&") > 0) ? content.videoUrl.lastIndexOf("&") : content.videoUrl.length)
    } else if(content.videoUrl) {
        videoID = content.videoUrl.substring(content.videoUrl.lastIndexOf("/") + 1)
    }

    return (
        <>
        <ContentMenu content={content} />
        <div className='map_page'>
            <Image className='image_background' width={1920} height={1080} src={content.images[0]} alt=""></Image>
            <div className='map_logo_foreground'>
                <div className='map_logo_container'>
                    {(content.videoUrl) ?  <div className='map_video'><iframe width="100%" height="100%" style={{aspectRatio: 16/9}} src={`https://www.youtube-nocookie.com/embed/${videoID}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe></div>: <Image priority className='map_logo' width={1920} height={1080} src={(content.images) ? content.images[0] : "/defaultBanner.png"} alt={t('Content.logo_alt', {title: content.title, type: content.type, minecraft_version: (content.files && content.files[0]) ? content.files[0].minecraftVersion : "", creator: (content.creators && content.creators.length > 0) ? content.creators[0].username : ""})}></Image>}
                </div>
            </div>
            <div className='centered_content'>
                <div className='map_title_bar'>
                    <div className="map_title_stack">
                        <h1 className='map_title'>{title}</h1>
                    </div>
                    <div className='map_download_stack'>
                        <Rating value={content.rating} content={content} />
                        {(content.files) ? <DownloadButton contentType={content.type} slug={content.slug} file={content.files[0]} />: <></>}
                        <Link className="affiliate_button" title={t('Content.affiliate', {type: t(content.type, {count: 1})})} href="https://www.minecraft-hosting.pro/?affiliate=468862"><IconButton><Server/></IconButton></Link>
                    </div>
                </div>
                <div className='map_information'>
                    <div className='map_description' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(description)}}>       
                    </div>
                    <div className='map_sidebar'>
                        {/* <AdsenseComponent adSlot={"9473945275"} adClient={"ca-pub-5425604215170333"} adFormat={"auto"} adLayout={undefined} width={"300px"} height={"300px"}/> */}
                        <section className='map_sidebar_section'>
                            {/* <IconButton className="secondary" onClick={() =>{}}><Flag /></IconButton> */}
                            <CreateTranslationForm type={collectionName} content={content} />
                        </section>
                        <section className='map_sidebar_section'>
                            <h4 className='header'>{t('Content.Sidebar.creators')}</h4>
                            {content.creators && content.creators.map((creator: ICreator, idx: number) => <CreatorCard key={creator.username} creator={creator} />)}
                        </section>
                        <section className='map_sidebar_section stats'>
                            <h4 className='header'>{t('Content.Sidebar.stats')}</h4>
                            <p className='stat_header'>{t('Content.Sidebar.downloads')} <span className='stat'>{content.downloads}</span></p>
                            <p className='stat_header'>{t('Content.Sidebar.ratings')} <span className='stat'>{(content.ratings) ? content.ratings.length : 0}</span></p>
                            {(content.files) ? <p className='stat_header'>{t('Content.Sidebar.minecraft_version')} <span className='stat'>{(content.files && content.files[0]) ? content.files[0].minecraftVersion : ""}</span></p> : <></> }
                            <p className='stat_header'>{t('Content.Sidebar.created_date')} <span className='stat'>{new Date(content.createdDate).toLocaleDateString()}</span></p>
                            {(content.updatedDate) ? <p className='stat_header'>{t('Content.Sidebar.updated_date')} <span className='stat'>{new Date(content.updatedDate).toLocaleDateString()}</span></p> : <></>}
                        </section>
                        <section className='map_sidebar_section'>
                            <h4 className='header'>{t('Content.Sidebar.tags')}</h4>
                            <div className={styles.tags_list}>
                                {content.tags && content.tags.map((tag: string, idx: number) => <Link className={styles.tag} key={tag} href={`/${content.type}s?includeTags=${tag}`}>{makeSentenceCase(tag)}</Link>)}
                            </div>
                        </section>
                        <section className='map_sidebar_section'>
                            <h4 className='header'>{t('Content.Sidebar.files')}</h4>
                            {content.files && content.files.slice(0, 3).map((file: IFile, idx: number) => <FileCard contentType={content.type} key={file.createdDate} file={file} slug={content.slug}/>)}
                        </section>
                    </div>
                </div>
            </div>
            <AdsenseComponent adSlot={"3283646290"} adClient={"ca-pub-5425604215170333"} adFormat={"auto"} adLayout={undefined} width={"1000px"} height={"100px"}/>
            <MapImageSlideshow images={content.images.slice(1)} />
            <CommentForm mapSlug={content.slug} content_type={contentType}></CommentForm>
            <Suspense fallback={<></>}>
                <CommentsList mapSlug={content.slug} content_type={collectionName}/>
            </Suspense>
        </div>
        </>
    )
}