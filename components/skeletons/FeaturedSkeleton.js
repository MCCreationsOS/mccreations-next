import Link from 'next/link'
import Image from "next/image";
import download from 'public/download.svg'
import heart from 'public/heart.svg';
import map from 'public/map.svg'
import { shimmer, toBase64 } from "./imageShimmer";

export default function FeaturedSkeleton() {
    return (
        <div className="featuredZone">
                    <div className="featuredCard active">
                        <Image className="featuredBackground" src={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} width={1920} height={1080}></Image>
                        <img className="featuredSlideArrowLeft" src="/chev-left.svg"></img>
                        <img className="featuredSlideArrowRight" src="/chev-right.svg" ></img>
                        <div className="featuredText">
                            <Image src={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} className="featuredImage" alt="" width={1920} height={1080}></Image>
                            <h2 className="featuredTitle"></h2>
                            <p className="featuredDescription"></p>
                            <p className="featuredAuthor"></p>
                            <div className='cardStats'>
                                        <div className="cardStat"><Image className="inTextIcon" src={download}></Image>0</div>
                                        <div className="cardStat"><Image className="inTextIcon" src={heart}></Image>0</div>
                                        <div className='cardStat'><Image className="inTextIcon" src={map}></Image>0</div>
                            </div>
                            <button className="buttonMain">See More!</button>
                            <div>
                                <div className="featuredSlideMarker active">
                                    <span className="featuredSlideMarkerColor" style={{margin: `0 -0%`}}></span> 
                                </div>
                            </div>
                        </div>
                    </div>
        </div>
    )
}
