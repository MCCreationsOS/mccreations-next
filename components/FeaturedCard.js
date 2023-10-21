'use client'

import { useEffect, useState } from "react";
import Link from 'next/link'

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
    return (
        <div className="featuredZone">
            {allFeatured.map((f, idx) => {
                return (
                    <div key={idx} className={(index === idx) ? "featuredCard active" : "featuredCard inactive"}>
                        <img className="featuredBackground" src={f.images[0]}></img>
                        <img className="featuredSlideArrowLeft" src="chev-left.svg" onClick={() => {slideButtonClicked(true)}}></img>
                        <img className="featuredSlideArrowRight" src="chev-right.svg" onClick={() => {slideButtonClicked(false)}}></img>
                        <div className="featuredText">
                            <img className="featuredImage" src={f.images[0]}></img>
                            <h2 className="featuredTitle">{f.title}</h2>
                            <p className="featuredDescription">{f.shortDescription}</p>
                            <p className="featuredAuthor">by {f.creators[0].username}</p>
                            <div className='cardStats'>
                                        <div className="cardStat"><img className="inTextIcon" src='/download.svg'></img>{f.downloads}</div>
                                        <div className="cardStat"><img className="inTextIcon" src='/heart.svg'></img>{f.likes}</div>
                                        <div className='cardStat'><img className="inTextIcon" src='/map.svg'></img>{f.files[0].minecraftVersion}</div>
                            </div>
                            <Link href={`/maps/${f.slug}`}><button className="buttonMain">Download</button></Link>
                            <div>
                                {
                                    allFeatured.map((f, idx) => {
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
