import Menu from '@components/Menu';
import Rating from '@components/Rating';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import CreatorCard from '@components/CreatorCard';
import FileCard from '@components/FileCard';
import Image from 'next/image';
import Link from 'next/link';
import MapImageSlideshow from '@components/MapImageSlideshow';
import Comments from '@components/Comments';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

async function getMap(slug) {
    let response = await fetch(`${process.env.DATA_URL}/maps/${slug}`, { next: { tags: [slug] }})
    let data = await response.json();
    return data
}

export default async function Page({params}) {
    console.log("Looking for map with slug " + params.slug)
    const map = await getMap(params.slug)

    let videoID = ""
    if(map.videoUrl && map.videoUrl.includes("?v=")) {
        videoID = map.videoUrl.substring(map.videoUrl.indexOf("?v=") + 3)
    } else if(map.videoUrl) {
        videoID = map.videoUrl.substring(map.videoUrl.lastIndexOf("/") + 1)
    }

    if(map) {
        return (
            <>
            <Menu></Menu>
            <div className='mapPage'>
                <Image className='mapPageBackground' width={1920} height={1080} src={map.images[0]}></Image>
                <div className='mapPageForeground'>
                    <div className='mapPageLogoContainer'>
                        {(map.videoUrl) ?  <div className='mapVideo'><iframe width="100%" height="100%" style={{aspectRatio: 16/9}} src={`https://www.youtube-nocookie.com/embed/${videoID}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>: <Image className='mapPageLogo' width={1920} height={1080} src={map.images[0]}></Image>}
                    </div>
                </div>
                <div className='mapInfo'>
                    <div className='mapPageTitleInfo'>
                        <div className="mapTitleStack">
                            <h1 className='mapPageTitle'>{map.title}</h1>
                        </div>
                        <div className='mapPageDownloadStack'>
                            <Rating value={map.rating} content={map} />
                            <Link href={map.files[0].worldUrl} className='buttonMain'>Download</Link>
                        </div>
                    </div>
                    <div className='mapDescription'>
                        <div className='mapDescriptionContent' dangerouslySetInnerHTML={{__html: purify.sanitize(map.description)}}>       
                        </div>
                        <div className='mapSidebar'>
                            <section className='mapSidebarSection'>
                                <h4 className='mapSidebarHeader'>Creators</h4>
                                {map.creators.map((creator, idx) => <CreatorCard key={idx} creator={creator} />)}
                            </section>
                            <section className='mapSidebarSection'>
                                <h4 className='mapSidebarHeader'>Stats</h4>
                                <p className='mapSidebarStatHeader'>Downloads <span className='mapSidebarStat'>{map.downloads}</span></p>
                                <p className='mapSidebarStatHeader'>Ratings <span className='mapSidebarStat'>{(map.ratings) ? map.ratings.length : 0}</span></p>
                                <p className='mapSidebarStatHeader'>Minecraft Version <span className='mapSidebarStat'>{map.files[0].minecraftVersion}</span></p>
                                <p className='mapSidebarStatHeader'>Created Date <span className='mapSidebarStat'>{new Date(map.createdDate).toLocaleDateString()}</span></p>
                                <p className='mapSidebarStatHeader'>Updated Date <span className='mapSidebarStat'>{new Date(map.updatedDate).toLocaleDateString()}</span></p>
                            </section>
                            <section className='mapSidebarSection'>
                                <h4 className='mapSidebarHeader'>Files</h4>
                                {map.files.map((file, idx) => <FileCard key={idx} file={file} />)}
                            </section>
                        </div>
                    </div>
                </div>
                <MapImageSlideshow images={map.images.slice(1)} />
                <Comments mapSlug={map.slug} comments={map.comments}/>
            </div>
            </>
        )
    } else {
        return (
            <div>
                <h1>Map Not Found</h1>
            </div>
        )
    }

}