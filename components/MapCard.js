import Link from "next/link";
import Image from "next/image";
import { shimmer, toBase64 } from "./skeletons/imageShimmer";

export default function MapCard({map, id, priority}) {

    let authorLink = map.creators[0].link;
    if(!authorLink || authorLink.length <= 0 || map.creators[0].hasMatchingUser) {
        authorLink = "/creators/" + map.creators[0].username
    }

    return (

            <div className='contentCard' id={id} >
                <div className="cardLogoFloat">
                    <div className='cardDescription'>
                        {map.shortDescription}
                        <div className='cardStats'>
                            <div className="cardStat"><img className="inTextIcon" src='/download.svg'></img>{map.downloads}</div>
                            <div className="cardStat"><img className="inTextIcon" src='/heart.svg'></img>{map.likes}</div>
                            <div className='cardStat'><img className="inTextIcon" src='/map.svg'></img>{map.files[0].minecraftVersion}</div>
                        </div>
                    </div>
                    <Image priority={priority} placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} className='cardImage' src={map.images[0]} width={1920} height={1080} sizes="25vw" alt={`The logo for ${map.title}, a Minecraft Map for ${map.files[0].minecraftVersion} by ${map.creators[0].username}`}></Image>
                </div>
                <Link className='cardTitle' href={`/maps/${map.slug}`}>{map.title}</Link>
                <p className='cardAuthor'>by <Link href={authorLink} className='cardAuthorLink'>{map.creators[0].username}</Link></p>
            </div>
    )
}