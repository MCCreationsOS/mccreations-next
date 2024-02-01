'use client'

import { ICreator, IFile, IMap } from "@/app/types";
import Menu from "../Menu";
import Image from 'next/image'
import Rating from "../Rating";
import { Suspense, useEffect, useState } from "react";
import CreatorCard from "../cards/CreatorCard";
import FileCard from "../cards/FileCard";
import MapImageSlideshow from "../slideshows/MapImageSlideshow";
import CommentForm from "../ComentForm";
import Comments from "../Comments";
import { fetchMap } from "@/app/api/content";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";

export default function MapComp({slug, map}: {slug: string, map?: any}) {
    if('_id' in map) {
        let videoID = ""
        if(map.videoUrl && map.videoUrl.includes("?v=")) {
            videoID = map.videoUrl.substring(map.videoUrl.indexOf("?v=") + 3)
        } else if(map.videoUrl) {
            videoID = map.videoUrl.substring(map.videoUrl.lastIndexOf("/") + 1)
        }
        return (
            <>
            <Menu selectedPage={"maps"}></Menu>
            <div className='map_page'>
                <Image className='image_background' width={1920} height={1080} src={map.images[0]} alt=""></Image>
                <div className='map_logo_foreground'>
                    <div className='map_logo_container'>
                        {(map.videoUrl) ?  <div className='map_video'><iframe width="100%" height="100%" style={{aspectRatio: 16/9}} src={`https://www.youtube-nocookie.com/embed/${videoID}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe></div>: <Image className='map_logo' width={1920} height={1080} src={map.images[0]} alt={`The logo for ${map.title}, a Minecraft Map for ${map.files[0].minecraftVersion} by ${map.creators[0].username}`}></Image>}
                    </div>
                </div>
                <div className='centered_content'>
                    <div className='map_title_bar'>
                        <div className="map_title_stack">
                            <h1 className='map_title'>{map.title}</h1>
                        </div>
                        <div className='map_download_stack'>
                            <Rating value={map.rating} content={map} />
                            <Link href={map.files[0].worldUrl} className='main_button'>Download</Link>
                        </div>
                    </div>
                    <div className='map_information'>
                        <div className='map_description' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(map.description)}}>       
                        </div>
                        <div className='map_sidebar'>
                            <section className='map_sidebar_section'>
                                <h4 className='header'>Creators</h4>
                                {map.creators.map((creator: ICreator, idx: number) => <CreatorCard key={idx} creator={creator} />)}
                            </section>
                            <section className='map_sidebar_section stats'>
                                <h4 className='header'>Stats</h4>
                                <p className='stat_header'>Downloads <span className='stat'>{map.downloads}</span></p>
                                <p className='stat_header'>Ratings <span className='stat'>{(map.ratings) ? map.ratings.length : 0}</span></p>
                                <p className='stat_header'>Minecraft Version <span className='stat'>{map.files[0].minecraftVersion}</span></p>
                                <p className='stat_header'>Created Date <span className='stat'>{new Date(map.createdDate).toLocaleDateString()}</span></p>
                                {(map.updatedDate) ? <p className='stat_header'>Updated Date <span className='stat'>{new Date(map.updatedDate).toLocaleDateString()}</span></p> : <></>}
                            </section>
                            <section className='map_sidebar_section'>
                                <h4 className='header'>Files</h4>
                                {map.files.map((file: IFile, idx: number) => <FileCard key={idx} file={file} />)}
                            </section>
                        </div>
                    </div>
                </div>
                <MapImageSlideshow images={map.images.slice(1)} />
                <CommentForm mapSlug={map.slug}></CommentForm>
                <Comments mapSlug={map.slug} comments={map.comments}/>
            </div>
            </>
        )
    } else {
        console.log('Fetch did not return map object')
        const [map, setMap] = useState<IMap>()

        useEffect(() => {
            const getData = async (token: string) => {
                setMap(await fetchMap(slug, token))
            }
            let token = sessionStorage.getItem('jwt')
            if(token) {
                getData(token)
            }
        }, [])


        if(map && '_id' in map) {
            let videoID = ""
            if(map.videoUrl && map.videoUrl.includes("?v=")) {
                videoID = map.videoUrl.substring(map.videoUrl.indexOf("?v=") + 3)
            } else if(map.videoUrl) {
                videoID = map.videoUrl.substring(map.videoUrl.lastIndexOf("/") + 1)
            }
            return (
                <>
                <Menu selectedPage={"maps"}></Menu>
                <div className='map_page'>
                    <Image className='image_background' width={1920} height={1080} src={map.images[0]} alt=""></Image>
                    <div className='map_logo_foreground'>
                        <div className='map_logo_container'>
                            {(map.videoUrl) ?  <div className='map_video'><iframe width="100%" height="100%" style={{aspectRatio: 16/9}} src={`https://www.youtube-nocookie.com/embed/${videoID}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe></div>: <Image className='map_logo' width={1920} height={1080} src={map.images[0]} alt={`The logo for ${map.title}, a Minecraft Map for ${map.files[0].minecraftVersion} by ${map.creators[0].username}`}></Image>}
                        </div>
                    </div>
                    <div className='centered_content'>
                        <div className='map_title_bar'>
                            <div className="map_title_stack">
                                <h1 className='map_title'>{map.title}</h1>
                            </div>
                            <div className='map_download_stack'>
                                <Rating value={map.rating} content={map} />
                                {/* <Link href={map.files[0].worldUrl} className='main_button'>Download</Link> */}
                            </div>
                        </div>
                        <div className='map_information'>
                            <div className='map_description' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(map.description)}}>       
                            </div>
                            <div className='map_sidebar'>
                                <section className='map_sidebar_section'>
                                    <h4 className='header'>Creators</h4>
                                    {map.creators.map((creator: ICreator, idx: number) => <Suspense><CreatorCard key={idx} creator={creator} /></Suspense>)}
                                </section>
                                <section className='map_sidebar_section stats'>
                                    <h4 className='header'>Stats</h4>
                                    <p className='stat_header'>Downloads <span className='stat'>{map.downloads}</span></p>
                                    <p className='stat_header'>Ratings <span className='stat'>{(map.ratings) ? map.ratings.length : 0}</span></p>
                                    <p className='stat_header'>Minecraft Version <span className='stat'>{map.files[0].minecraftVersion}</span></p>
                                    <p className='stat_header'>Created Date <span className='stat'>{new Date(map.createdDate).toLocaleDateString()}</span></p>
                                    {(map.updatedDate) ? <p className='stat_header'>Updated Date <span className='stat'>{new Date(map.updatedDate).toLocaleDateString()}</span></p> : <></>}
                                </section>
                                <section className='map_sidebar_section'>
                                    <h4 className='header'>Files</h4>
                                    {map.files.map((file: IFile, idx: number) => <FileCard key={idx} file={file} />)}
                                </section>
                            </div>
                        </div>
                    </div>
                    <MapImageSlideshow images={map.images.slice(1)} />
                    <CommentForm mapSlug={map.slug}></CommentForm>
                    <Comments mapSlug={map.slug} comments={map.comments}/>
                </div>
                </>
            )
        } else {
            return (
                <div>
                    <Menu selectedPage=""></Menu>
                    <h1>Map Not Found</h1>
                </div>
            )
        }
    }
}


