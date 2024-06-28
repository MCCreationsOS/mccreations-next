import { ICreator, IFile, IContentDoc } from "@/app/types";
import Image from 'next/image'
import Rating from "../Rating";
import CreatorCard from "../Creator/CreatorCard";
import FileCard from "../File/FileCard";
import MapImageSlideshow from "../MapImageSlideshow/MapImageSlideshow";
import CommentForm from "../ComentForm";
import PretechedCommentsList from "@/components/Comment/CommentsList";
import DOMPurify from "isomorphic-dompurify";
import ContentMenu from "./ContentMenu";
import ContentWarnings from "./ContentWarnings";
import { downloadMap } from "@/app/api/content";
import { useRouter } from "next/navigation";
import MainButton from "../Buttons/MainButton";
import IconButton from "../Buttons/IconButton";
import { Server } from "react-feather";
import Link from "next/link";

/**
 * The map component represents all the information displayed on a map page
 * @param map The map to display
 * @param privileged If the user is privileged to see the content
 */
export default function MapComponent({map}: {map: IContentDoc}) {
    const router = useRouter()

    let videoID = ""
    if(map.videoUrl && map.videoUrl.includes("?v=")) {
        videoID = map.videoUrl.substring(map.videoUrl.indexOf("?v=") + 3)
    } else if(map.videoUrl) {
        videoID = map.videoUrl.substring(map.videoUrl.lastIndexOf("/") + 1)
    }

    const downloadButtonClicked = async (url: string) => {
        await downloadMap(map.slug)
        router.push(url)
    }

    return (
        <>
        <ContentWarnings map={map} />
        <ContentMenu slug={map.slug} creators={map.creators} status={map.status} />
        <div className='map_page'>
            <Image className='image_background' width={1920} height={1080} src={map.images[0]} alt=""></Image>
            <div className='map_logo_foreground'>
                <div className='map_logo_container'>
                    {(map.videoUrl) ?  <div className='map_video'><iframe width="100%" height="100%" style={{aspectRatio: 16/9}} src={`https://www.youtube-nocookie.com/embed/${videoID}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe></div>: <Image priority className='map_logo' width={1920} height={1080} src={(map.images) ? map.images[0] : "/defaultBanner.png"} alt={`The logo for ${map.title}, a Minecraft Map for ${(map.files) ? map.files[0].minecraftVersion: ""} by ${(map.creators) ? map.creators[0].username: ""}`}></Image>}
                </div>
            </div>
            <div className='centered_content'>
                <div className='map_title_bar'>
                    <div className="map_title_stack">
                        <h1 className='map_title'>{map.title}</h1>
                    </div>
                    <div className='map_download_stack'>
                        <Rating value={map.rating} content={map} />
                        {(map.files) ? <MainButton onClick={() => {downloadButtonClicked(map.files[0].worldUrl)}}>Download</MainButton>: <></>}
                        <Link title="Get a server for this map for 25% off" href="https://www.minecraft-hosting.pro/?affiliate=468862"><IconButton><Server/></IconButton></Link>
                    </div>
                </div>
                <div className='map_information'>
                    <div className='map_description' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(map.description)}}>       
                    </div>
                    <div className='map_sidebar'>
                        <section className='map_sidebar_section'>
                            <h4 className='header'>Creators</h4>
                            {map.creators && map.creators.map((creator: ICreator, idx: number) => <CreatorCard key={idx} creator={creator} />)}
                        </section>
                        <section className='map_sidebar_section stats'>
                            <h4 className='header'>Stats</h4>
                            <p className='stat_header'>Downloads <span className='stat'>{map.downloads}</span></p>
                            <p className='stat_header'>Ratings <span className='stat'>{(map.ratings) ? map.ratings.length : 0}</span></p>
                            {(map.files) ? <p className='stat_header'>Minecraft Version <span className='stat'>{map.files[0].minecraftVersion}</span></p> : <></> }
                            <p className='stat_header'>Created Date <span className='stat'>{new Date(map.createdDate).toLocaleDateString()}</span></p>
                            {(map.updatedDate) ? <p className='stat_header'>Updated Date <span className='stat'>{new Date(map.updatedDate).toLocaleDateString()}</span></p> : <></>}
                        </section>
                        <section className='map_sidebar_section'>
                            <h4 className='header'>Files</h4>
                            {map.files && map.files.slice(0, 3).map((file: IFile, idx: number) => <FileCard key={idx} file={file} download={downloadButtonClicked}/>)}
                        </section>
                    </div>
                </div>
            </div>
            <MapImageSlideshow images={map.images.slice(1)} />
            <CommentForm mapSlug={map.slug} content_type="Maps"></CommentForm>
            <PretechedCommentsList mapSlug={map.slug} comments={map.comments}/>
        </div>
        </>
    )
}