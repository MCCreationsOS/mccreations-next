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
export default function DatapackComponent({datapack}: {datapack: IContentDoc}) {
    const router = useRouter()

    let videoID = ""
    if(datapack.videoUrl && datapack.videoUrl.includes("?v=")) {
        videoID = datapack.videoUrl.substring(datapack.videoUrl.indexOf("?v=") + 3)
    } else if(datapack.videoUrl) {
        videoID = datapack.videoUrl.substring(datapack.videoUrl.lastIndexOf("/") + 1)
    }

    const downloadButtonClicked = async (url: string) => {
        await downloadMap(datapack.slug)
        router.push(url)
    }

    return (
        <>
        <ContentWarnings map={datapack} />
        <ContentMenu slug={datapack.slug} creators={datapack.creators} status={datapack.status} />
        <div className='map_page'>
            <Image className='image_background' width={1920} height={1080} src={datapack.images[0]} alt=""></Image>
            <div className='map_logo_foreground'>
                <div className='map_logo_container'>
                    {(datapack.videoUrl) ?  <div className='map_video'><iframe width="100%" height="100%" style={{aspectRatio: 16/9}} src={`https://www.youtube-nocookie.com/embed/${videoID}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe></div>: <Image priority className='map_logo' width={1920} height={1080} src={(datapack.images) ? datapack.images[0] : "/defaultBanner.png"} alt={`The logo for ${datapack.title}, a Minecraft Map for ${(datapack.files) ? datapack.files[0].minecraftVersion: ""} by ${(datapack.creators) ? datapack.creators[0].username: ""}`}></Image>}
                </div>
            </div>
            <div className='centered_content'>
                <div className='map_title_bar'>
                    <div className="map_title_stack">
                        <h1 className='map_title'>{datapack.title}</h1>
                    </div>
                    <div className='map_download_stack'>
                        <Rating value={datapack.rating} content={datapack} />
                        {(datapack.files) ? <MainButton onClick={() => {downloadButtonClicked(datapack.files[0].worldUrl)}}>Download</MainButton>: <></>}
                        <Link title="Get a server for this datapack for 25% off" href="https://www.minecraft-hosting.pro/?affiliate=468862"><IconButton><Server/></IconButton></Link>
                    </div>
                </div>
                <div className='map_information'>
                    <div className='map_description' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(datapack.description)}}>       
                    </div>
                    <div className='map_sidebar'>
                        <section className='map_sidebar_section'>
                            <h4 className='header'>Creators</h4>
                            {datapack.creators && datapack.creators.map((creator: ICreator, idx: number) => <CreatorCard key={idx} creator={creator} />)}
                        </section>
                        <section className='map_sidebar_section stats'>
                            <h4 className='header'>Stats</h4>
                            <p className='stat_header'>Downloads <span className='stat'>{datapack.downloads}</span></p>
                            <p className='stat_header'>Ratings <span className='stat'>{(datapack.ratings) ? datapack.ratings.length : 0}</span></p>
                            {(datapack.files) ? <p className='stat_header'>Minecraft Version <span className='stat'>{datapack.files[0].minecraftVersion}</span></p> : <></> }
                            <p className='stat_header'>Created Date <span className='stat'>{new Date(datapack.createdDate).toLocaleDateString()}</span></p>
                            {(datapack.updatedDate) ? <p className='stat_header'>Updated Date <span className='stat'>{new Date(datapack.updatedDate).toLocaleDateString()}</span></p> : <></>}
                        </section>
                        <section className='map_sidebar_section'>
                            <h4 className='header'>Files</h4>
                            {datapack.files && datapack.files.slice(0, 3).map((file: IFile, idx: number) => <FileCard key={idx} file={file} download={downloadButtonClicked}/>)}
                        </section>
                    </div>
                </div>
            </div>
            <MapImageSlideshow images={datapack.images.slice(1)} />
            <CommentForm mapSlug={datapack.slug} content_type="datapack"></CommentForm>
            <PretechedCommentsList mapSlug={datapack.slug} comments={datapack.comments}/>
        </div>
        </>
    )
}