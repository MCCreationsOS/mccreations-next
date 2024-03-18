import Link from "next/link";
import Image from "next/image";
import { shimmer, toBase64 } from "../skeletons/imageShimmer";
import { IMap } from "@/app/types";

export default function MapCard({map, id, priority}: {map: IMap, id: string, priority: boolean}) {

    // let authorLink = map.creators[0].link;
    // if(!authorLink || authorLink.length <= 0 || map.creators[0].hasMatchingUser) {
    //     authorLink = "/creators/" + map.creators[0].username
    // }

    return (
        <div className='content_card' id={id} >
            <div className="information">
                <div className='description'>
                    {map.shortDescription}
                    <div className='stats'>
                        <div className="stat"><img className="in_text_icon" src='/download.svg'></img>{map.downloads}</div>
                        {(map.rating > 0) ? <div className="stat"><img className="in_text_icon" src='/star_white.svg'></img>{(Math.round(map.rating*100)/100) * 5}</div>: <></> }
                        {(map.files && map.files.length > 0) ? <div className='stat'><img className="in_text_icon" src='/map.svg'></img>{map.files[0].minecraftVersion}</div>: <></> }
                    </div>
                </div>
                <Image priority={priority} placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} className='logo' src={map.images[0]} width={1920} height={1080} sizes="25vw" alt={`The logo for ${map.title}, a Minecraft Map for ${(map.files && map.files.length > 0) ? map.files[0].minecraftVersion : ""} by ${map.creators[0].username}`}></Image>
            </div>
            <Link className='title' href={`/maps/${map.slug}`}>{map.title}</Link>
            <p className='author'>by <span className='cardAuthorLink'>{map.creators[0].username}</span></p>
        </div>
    )
}