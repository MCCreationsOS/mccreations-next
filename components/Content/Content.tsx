'use client'
import { ICreator, IFile, IContentDoc, ContentTypes, Locales } from "@/app/api/types";
import Image from 'next/image'
import Rating from "../Rating";
import CreatorCard from "../Creator/CreatorCard";
import FileCard from "../File/FileCard";
import MapImageSlideshow from "../MapImageSlideshow/MapImageSlideshow";
import CommentForm from "../Comment/ComentForm";
import CommentsList from "@/components/Comment/CommentsList";
import DOMPurify from "isomorphic-dompurify";
import ContentMenu from "./ContentMenu";
import ContentWarnings from "./ContentWarnings";
import IconButton from "../Buttons/IconButton";
import { Server } from "react-feather";
import Link from "next/link";
import { useCurrentLocale, useI18n } from "@/locales/client";
import DownloadButton from "../Buttons/DownloadButton";
import CreateTranslationForm from "../CreateTranslationForm";
import { Suspense } from "react";

/**
 * The map component represents all the information displayed on a map page
 * @param map The map to display
 * @param privileged If the user is privileged to see the content
 */
export default function Content({content, contentType}: {content: IContentDoc, contentType: ContentTypes}) {
    const t = useI18n();
    const locale = useCurrentLocale();

    let title = content.title
    let description = content.description
    
    if(content.translations && content.translations[locale] && content.translations[locale].approved) {
        title = content.translations[locale].title
        description = content.translations[locale].description
    }

    let videoID = ""
    if(content.videoUrl && content.videoUrl.includes("?v=")) {
        videoID = content.videoUrl.substring(content.videoUrl.indexOf("?v=") + 3, content.videoUrl.lastIndexOf("&"))
    } else if(content.videoUrl) {
        videoID = content.videoUrl.substring(content.videoUrl.lastIndexOf("/") + 1)
    }

    return (
        <>
        <ContentWarnings map={content} />
        <ContentMenu slug={content.slug} creators={content.creators} status={content.status} />
        <div className='map_page'>
            <Image className='image_background' width={1920} height={1080} src={content.images[0]} alt=""></Image>
            <div className='map_logo_foreground'>
                <div className='map_logo_container'>
                    {(content.videoUrl) ?  <div className='map_video'><iframe width="100%" height="100%" style={{aspectRatio: 16/9}} src={`https://www.youtube-nocookie.com/embed/${videoID}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe></div>: <Image priority className='map_logo' width={1920} height={1080} src={(content.images) ? content.images[0] : "/defaultBanner.png"} alt={`${t('content.logo.alt1')}${content.title}${t('content.logo.alt2')}${contentType.substring(0, contentType.length - 1)}${t('content.logo.alt3')}${(content.files) ? content.files[0].minecraftVersion: ""}${t('content.logo.alt4')}${(content.creators) ? content.creators[0].username: ""}`}></Image>}
                </div>
            </div>
            <div className='centered_content'>
                <div className='map_title_bar'>
                    <div className="map_title_stack">
                        <h1 className='map_title'>{title}</h1>
                    </div>
                    <div className='map_download_stack'>
                        <Rating value={content.rating} content={content} />
                        {(content.files) ? <DownloadButton slug={content.slug} file={content.files[0]} types={[ContentTypes.Maps, ContentTypes.Resourcepacks, ContentTypes.Datapacks]}/>: <></>}
                        <Link title={t(`content.affiliates.server.${contentType}`)} href="https://www.minecraft-hosting.pro/?affiliate=468862"><IconButton><Server/></IconButton></Link>
                    </div>
                </div>
                <div className='map_information'>
                    <div className='map_description' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(description)}}>       
                    </div>
                    <div className='map_sidebar'>
                        <section className='map_sidebar_section'>
                            {/* <IconButton className="secondary" onClick={() =>{}}><Flag /></IconButton> */}
                            <CreateTranslationForm type={contentType} content={content} />
                        </section>
                        <section className='map_sidebar_section'>
                            <h4 className='header'>{t('content.sidebar.headers.creators')}</h4>
                            {content.creators && content.creators.map((creator: ICreator, idx: number) => <CreatorCard key={idx} creator={creator} />)}
                        </section>
                        <section className='map_sidebar_section stats'>
                            <h4 className='header'>{t('content.sidebar.headers.stats')}</h4>
                            <p className='stat_header'>{t('content.sidebar.stats.downloads')} <span className='stat'>{content.downloads}</span></p>
                            <p className='stat_header'>{t('content.sidebar.stats.ratings')} <span className='stat'>{(content.ratings) ? content.ratings.length : 0}</span></p>
                            {(content.files) ? <p className='stat_header'>{t('content.sidebar.stats.minecraft_version')} <span className='stat'>{content.files[0].minecraftVersion}</span></p> : <></> }
                            <p className='stat_header'>{t('content.sidebar.stats.created_date')} <span className='stat'>{new Date(content.createdDate).toLocaleDateString()}</span></p>
                            {(content.updatedDate) ? <p className='stat_header'>{t('content.sidebar.stats.updated_date')} <span className='stat'>{new Date(content.updatedDate).toLocaleDateString()}</span></p> : <></>}
                        </section>
                        <section className='map_sidebar_section'>
                            <h4 className='header'>{t('content.sidebar.headers.files')}</h4>
                            {content.files && content.files.slice(0, 3).map((file: IFile, idx: number) => <FileCard key={idx} file={file} slug={content.slug}/>)}
                        </section>
                    </div>
                </div>
            </div>
            <MapImageSlideshow images={content.images.slice(1)} />
            <CommentForm mapSlug={content.slug} content_type={contentType}></CommentForm>
            <Suspense fallback={<></>}>
                <CommentsList mapSlug={content.slug} content_type={contentType}/>
            </Suspense>
        </div>
        </>
    )
}