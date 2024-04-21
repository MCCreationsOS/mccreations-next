'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import { shimmer, toBase64 } from "../skeletons/imageShimmer";
import styles from './MapImageSlideshow.module.css'

/**
 * The slideshow of images on a map page
 * @param images The images to display
 */
export default function MapImageSlideshow({images}: {images: string[]}) {
    const [index, setIndex] = useState(0)
    const [slideTime, setSlideTime] = useState(510);

    const updateSlide = () => {
        if(slideTime > 0) {
            setSlideTime(slideTime => slideTime - 1);
        } else {
            if(index < images.length) {
                setIndex(index => index + 1)
            }

            if(index >= images.length) {
                setIndex(0)
            }
            setSlideTime(510);
        }
    }

    if(index >= images.length && index != 0) {
        setIndex(0)
    }

    useEffect(() => {
        if(images.length > 1) {
            const slideTicker = setInterval(() => {updateSlide()}, 17);
            return () => clearInterval(slideTicker);
        }
        return;
    }, [slideTime, index])

    const slideButtonClicked = (left: boolean) => {
        setSlideTime(510)
        if(left) {
            setIndex(index => index - 1)
        } else {
            setIndex(index => index + 1)
        }
    }

    const setSlide = (index: number) => {
        setSlideTime(510)
        setIndex(index);
    }
    if(images.length == 0) {
        return (
            <></>
        )
    }
    return (
        <div className={styles.slideshow}>
            {images.map((f: string, idx: number) => {
                return (
                    <div key={idx} className={(index === idx) ? `${styles.slide} ${styles.active}` : `${styles.slide} ${styles.inactive}`}>
                        <Image className={styles.image_background} src={f} width={1920} height={1080} alt=""></Image>
                        <img className={`${styles.nav_arrow} ${styles.left}`} src="/chev-left.svg" onClick={() => {slideButtonClicked(true)}}></img>
                        <img className={`${styles.nav_arrow} ${styles.right}`} src="/chev-right.svg" onClick={() => {slideButtonClicked(false)}}></img>
                        <div className={styles.information}>
                            <Image alt="" placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} className={styles.image} src={f} width={1920} height={1080}></Image>
                        <div className={styles.markers}>
                                {
                                    images.map((f: string, idx: number) => {
                                        return (
                                            <div onClick={() => setSlide(idx)} key={idx} className={(index === idx) ? `${styles.marker} ${styles.active}` : styles.marker}>
                                                {index === idx ? (<span className={styles.color} style={{width: `${slideTime/10}px`}}></span>): (<span className={styles.color}></span>)} 
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
