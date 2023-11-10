'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import { shimmer, toBase64 } from "../skeletons/imageShimmer";

export default function MapImageSlideshow({images}: {images: string[]}) {
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
        if(images.length > 1) {
            const slideTicker = setInterval(() => {updateSlide()}, 100);
            return () => clearInterval(slideTicker);
        }
    }, [slideTime, index])

    const slideButtonClicked = (left: boolean) => {
        setSlideTime(0)
        if(left) {
            setIndex(index => index - 1)
        } else {
            setIndex(index => index + 1)
        }
    }

    const setSlide = (index: number) => {
        setSlideTime(0)
        setIndex(index);
    }
    return (
        <div className="big_slideshow map_images">
            {images.map((f: string, idx: number) => {
                return (
                    <div key={idx} className={(index === idx) ? "slide active" : "slide inactive"}>
                        <Image className="image_background" src={f} width={1920} height={1080} alt=""></Image>
                        <img className="nav_arrow left" src="/chev-left.svg" onClick={() => {slideButtonClicked(true)}}></img>
                        <img className="nav_arrow right" src="/chev-right.svg" onClick={() => {slideButtonClicked(false)}}></img>
                        <div className="information">
                            <Image alt="" placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} className="image" src={f} width={1920} height={1080}></Image>
                        <div className="centered_markers">
                                {
                                    images.map((f: string, idx: number) => {
                                        return (
                                            <div onClick={() => setSlide(idx)} key={idx} className={(index === idx) ? "marker active" : "marker"}>
                                                {index === idx ? (<span className="color" style={{margin: `0 -${slideTime}%`}}></span>): (<span className="color"></span>)} 
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
