'use client'

import { useEffect, useState } from "react";
import Link from 'next/link'
import Image from "next/image";
import download from 'public/download.svg'
import heart from 'public/heart.svg';
import map from 'public/map.svg'
import { shimmer, toBase64 } from "./skeletons/imageShimmer";

export default function FeaturedCard({allFeatured}) {
    const [index, setIndex] = useState(0)
    const [slideTime, setSlideTime] = useState(0);

    const updateSlide = () => {
        if(slideTime < 100) {
            setSlideTime(slideTime => slideTime + 1);
        } else {
            if(index < allFeatured.length) {
                setIndex(index => index + 1)
            }

            if(index >= allFeatured.length) {
                setIndex(0)
            }
            setSlideTime(0);
        }
    }

    if(index >= allFeatured.length) {
        setIndex(0)
    }

    useEffect(() => {
        const slideTicker = setInterval(() => {updateSlide()}, 150);
        return () => clearInterval(slideTicker);
    }, [slideTime, index])

    const slideButtonClicked = (left) => {
        setSlideTime(0)
        if(left) {
            setIndex(index => index - 1)
        } else {
            setIndex(index => index + 1)
        }
    }

    const setSlide = (index) => {
        setSlideTime(0)
        setIndex(index);
    }
    return (
        <div className="featuredZone">
            {allFeatured.map((f, idx) => {
                return (
                    <div key={idx} className={(index === idx) ? "featuredCard active" : "featuredCard inactive"}>
                        <Image className="featuredBackground" src={f.images[0]} width={1920} height={1080}></Image>
                        <img className="featuredSlideArrowLeft" src="/chev-left.svg" onClick={() => {slideButtonClicked(true)}}></img>
                        <img className="featuredSlideArrowRight" src="/chev-right.svg" onClick={() => {slideButtonClicked(false)}}></img>
                        <div className="featuredText">
                            <Image placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} priority={true} className="featuredImage" src={f.images[0]} width={1920} height={1080} alt={`The logo for ${f.title}, a Minecraft Map for ${f.files[0].minecraftVersion} by ${f.creators[0].username}`}></Image>
                            <h2 className="featuredTitle">{f.title}</h2>
                            <p className="featuredDescription">{f.shortDescription}</p>
                            <p className="featuredAuthor">by {f.creators[0].username}</p>
                            <div className='cardStats'>
                                        <div className="cardStat"><Image className="inTextIcon" src={download}></Image>{f.downloads}</div>
                                        <div className="cardStat"><Image className="inTextIcon" src={heart}></Image>{f.likes}</div>
                                        <div className='cardStat'><Image className="inTextIcon" src={map}></Image>{f.files[0].minecraftVersion}</div>
                            </div>
                            <Link href={`/maps/${f.slug}`}><button className="buttonMain">See More!</button></Link>
                            <div>
                                {
                                    allFeatured.map((f, idx) => {
                                        return (
                                            <div onClick={() => setSlide(idx)} key={idx} className={(index === idx) ? "featuredSlideMarker active" : "featuredSlideMarker"}>
                                                {index === idx ? (<span className="featuredSlideMarkerColor" style={{margin: `0 -${slideTime}%`}}></span>): (<span className="featuredSlideMarkerColor"></span>)} 
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
