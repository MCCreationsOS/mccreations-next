'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import { shimmer, toBase64 } from "./skeletons/imageShimmer";

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

    const setSlide = (index) => {
        setSlideTime(0)
        setIndex(index);
    }
    return (
        <div className="mapImageSlideshow">
            {images.map((f, idx) => {
                return (
                    <div key={idx} className={(index === idx) ? "mapImage active" : "mapImage inactive"}>
                        <Image className="mapImageBackground" src={f} width={1920} height={1080}></Image>
                        <img className="mapImageSlideArrowLeft" src="/chev-left.svg" onClick={() => {slideButtonClicked(true)}}></img>
                        <img className="mapImageSlideArrowRight" src="/chev-right.svg" onClick={() => {slideButtonClicked(false)}}></img>
                        <div className="mapSlideshowText">
                            <Image alt="" placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} className="mapSlideshowImage" src={f} width={1920} height={1080}></Image>
                        <div className="mapImageSlideshowMarkers">
                                {
                                    images.map((f, idx) => {
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
