import Link from "next/link";
import Image from "next/image";
import { shimmer, toBase64 } from "../skeletons/imageShimmer";
import { IMap } from "@/app/types";

export default function ContentScrollCard({map, id, priority}: {map: IMap, id: string, priority: boolean}) {

    // let authorLink = map.creators[0].link;
    // if(!authorLink || authorLink.length <= 0 || map.creators[0].hasMatchingUser) {
    //     authorLink = "/creators/" + map.creators[0].username
    // }

    return (
        <div className='content_card' id={id} >
            <div className="information">
                <Image priority={priority} className='logo' src={map.images[0]} width={1920} height={1080} sizes="25vw" alt={`The logo for ${map.title}, a Minecraft Map for ${map.files[0].minecraftVersion} by ${map.creators[0].username}`}></Image>
            </div>
        </div>
    )
}