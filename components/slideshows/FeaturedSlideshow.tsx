'use client'

import { useEffect, useState } from "react";
import Link from 'next/link'
import Image from "next/image";
import download from 'public/download.svg'
import heart from 'public/heart.svg';
import map from 'public/map.svg'
import { shimmer, toBase64 } from "../skeletons/imageShimmer";
import { IMap } from "@/app/types";

export default function FeaturedCard({allFeatured}: {allFeatured: IMap[]}) {
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

    if((index >= allFeatured.length || index < 0) && index != 0) {
        setIndex(0)
    }

    useEffect(() => {
        const slideTicker = setInterval(() => {updateSlide()}, 150);
        return () => clearInterval(slideTicker);
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
        <div className="big_slideshow featured">
            {allFeatured.map((f: IMap, idx: number) => {
                return (
                    <div key={idx} className={(index === idx) ? "slide active" : "slide inactive"}>
                        <Image className="image_background" src={f.images[0]} width={1920} height={1080} alt=""></Image>
                        <img className="nav_arrow left" src="/chev-left.svg" onClick={() => {slideButtonClicked(true)}}></img>
                        <img className="nav_arrow right" src="/chev-right.svg" onClick={() => {slideButtonClicked(false)}}></img>
                        <div className="information">
                            <Image placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} priority={true} className="image" src={f.images[0]} width={1920} height={1080} alt={`The logo for ${f.title}, a Minecraft Map for ${f.files[0].minecraftVersion} by ${f.creators[0].username}`}></Image>
                            <h2 className="title">{f.title}</h2>
                            <p className="description">{f.shortDescription}</p>
                            <p className="author">by {f.creators[0].username}</p>
                            <div className='stats'>
                                <div className="stat"><img className="in_text_icon" src='/download.svg'></img>{f.downloads}</div>
                                {(f.rating > 0) ? <div className="stat"><img className="in_text_icon" src='/star_white.svg'></img>{(Math.round(f.rating*100)/100) * 5}</div>: <></> }
                                <div className='stat'><img className="in_text_icon" src='/map.svg'></img>{f.files[0].minecraftVersion}</div>
                            </div>
                            <Link href={`/maps/${f.slug}`}><button className="main_button">See More!</button></Link>
                            <div>
                                {
                                    allFeatured.map((f: IMap, idx: number) => {
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
