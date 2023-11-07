import Link from 'next/link'
import Image from "next/image";
import download from 'public/download.svg'
import heart from 'public/heart.svg';
import map from 'public/map.svg'
import { shimmer, toBase64 } from "./imageShimmer";

export default function FeaturedSkeleton() {
    return (
        <div className="big_slideshow featured">
            <div className="slide active">
                <Image className="image_background" src={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} width={1920} height={1080}></Image>
                <img className="nav_arrow left" src="/chev-left.svg"></img>
                <img className="nav_arrow right" src="/chev-right.svg"></img>
                <div className="information">
                    <Image className="image" src={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} width={1920} height={1080} alt={""}></Image>
                    <h2 className="title"></h2>
                    <p className="description"></p>
                    <p className="author"></p>
                    <div className='stats'>
                        <div className="cardStat"><Image className="inTextIcon" src={download}></Image></div>
                        <div className="cardStat"><Image className="inTextIcon" src={heart}></Image></div>
                        <div className='cardStat'><Image className="inTextIcon" src={map}></Image></div>
                    </div>
                    <Link href={""}><button className="main_button">See More!</button></Link>
                    <div>
                        <div className="marker active">
                            <span className="color" style={{margin: `0 -0%`}}></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
