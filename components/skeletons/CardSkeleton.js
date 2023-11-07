import Link from "next/link";
import Image from "next/image";
import { shimmer, toBase64 } from "./imageShimmer";

export default function CardSkeleton() {
    return (
        <div className='content_card' >
            <div className="information">
                <div className='description'>
                    <div className='stats'>
                        <div className="stat"><img className="in_text_icon" src='/download.svg'></img></div>
                        <div className="stat"><img className="in_text_icon" src='/star_white.svg'></img></div>
                        <div className='stat'><img className="in_text_icon" src='/map.svg'></img></div>
                    </div>
                </div>
                <Image src={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} className='logo' width={1920} height={1080} sizes="25vw" alt={""}></Image>
            </div>
            <p className='title'></p>
            <p className='author'>by</p>
        </div>
    )
}