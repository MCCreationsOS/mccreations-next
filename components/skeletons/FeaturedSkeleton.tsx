import { Link } from "@/app/api/navigation";
import Image from "next/image";
import { shimmer, toBase64 } from "./imageShimmer";
import MainButton from '../Buttons/MainButton';

export default function FeaturedSkeleton() {
    return (
        <div className="big_slideshow featured">
            <div className="slide active">
                <Image className="image_background" src={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} width={1920} height={1080} alt=""></Image>
                <img className="nav_arrow left" src="/chev-left.svg"></img>
                <img className="nav_arrow right" src="/chev-right.svg"></img>
                <div className="information">
                    <Image className="image" src={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} width={1920} height={1080} alt={""}></Image>
                    <h2 className="title"></h2>
                    <p className="description"></p>
                    <p className="author"></p>
                    <div className='stats'>
                        <div className="cardStat"><Image className="inTextIcon" src={"/download.svg"} alt="" width={16} height={16}></Image></div>
                        <div className="cardStat"><Image className="inTextIcon" src={"/heart.svg"} alt="" width={16} height={16}></Image></div>
                        <div className='cardStat'><Image className="inTextIcon" src={"/map.svg"} alt="" width={16} height={16}></Image></div>
                    </div>
                    <MainButton>See More!</MainButton>
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
