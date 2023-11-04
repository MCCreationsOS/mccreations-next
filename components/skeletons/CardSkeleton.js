import Link from "next/link";
import Image from "next/image";
import { shimmer, toBase64 } from "./imageShimmer";

export default function CardSkeleton() {
    return (

            <div className='contentCard'>
                <div className="cardLogoFloat">
                    <div className='cardDescription'>
                        Loading...
                        <div className='cardStats'>
                            <div className="cardStat"><img className="inTextIcon" src='/download.svg'></img>0</div>
                            <div className="cardStat"><img className="inTextIcon" src='/heart.svg'></img>0</div>
                            <div className='cardStat'><img className="inTextIcon" src='/map.svg'></img>0</div>
                        </div>
                    </div>
                    <Image src={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} className='cardImage' width={1920} height={1080} sizes="25vw" alt=""></Image>
                </div>
                <a className='cardTitle' href={null}>Loading...</a>
                <p className='cardAuthor'>by Loading...</p>
            </div>
    )
}