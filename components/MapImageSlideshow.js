'use client'

import { useEffect, useState } from "react";
import Link from 'next/link'
import Image from "next/image";
import chevLeft from 'public/chev-left.svg'
import chevRight from 'public/chev-right.svg'
import download from 'public/download.svg'
import heart from 'public/heart.svg';
import map from 'public/map.svg'

export default function MapImageSlideshow({images}) {
    const [index, setIndex] = useState(0)
    const [slideTime, setSlideTime] = useState(0);

    const updateSlide = () => {
        if(slideTime < 100) {
            setSlideTime(slideTime => slideTime + 1);
        } else {
            if(index < images.length) {
                setIndex(index => index + 1)
            }

            if(index >= images.length) {
                setIndex(0)
            }
            setSlideTime(0);
        }
    }

    if(index >= images.length) {
        setIndex(0)
    }

    useEffect(() => {
        const slideTicker = setInterval(() => {updateSlide()}, 100);
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
    return (
        <div className="mapImageSlideshow">
            {images.map((f, idx) => {
                return (
                    <div key={idx} className={(index === idx) ? "mapImage active" : "mapImage inactive"}>
                        <Image className="mapImageBackground" src={f} width={1920} height={1080}></Image>
                        <Image className="mapImageSlideArrowLeft" src={chevLeft} onClick={() => {slideButtonClicked(true)}}></Image>
                        <Image className="mapImageSlideArrowRight" src={chevRight} onClick={() => {slideButtonClicked(false)}}></Image>
                        <div className="mapSlideshowText">
                            <Image className="mapSlideshowImage" src={f} width={1920} height={1080}></Image>
                        <div className="mapImageSlideshowMarkers">
                                {
                                    images.map((f, idx) => {
                                        return (
                                            <div key={idx} className={(index === idx) ? "featuredSlideMarker active" : "featuredSlideMarker"}>
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
