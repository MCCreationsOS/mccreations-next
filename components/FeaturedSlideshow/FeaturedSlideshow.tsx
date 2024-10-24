'use client'

import { useEffect, useState } from "react";
import { Link } from "@/app/api/navigation";
import Image from "next/image";
import styles from './FeaturedSlideshow.module.css'
import { shimmer, toBase64 } from "../skeletons/imageShimmer";
import { IContentDoc } from "@/app/api/types";
import MainButton from "../Buttons/MainButton";
import {useTranslations} from 'next-intl';


export default function FeaturedSlideshow({content}: {content: IContentDoc[]}) {
    const [index, setIndex] = useState(0)
    const [slideTime, setSlideTime] = useState(720);
    const t = useTranslations()

    const updateSlide = () => {
        if(slideTime > 0) {
            setSlideTime(slideTime => slideTime - 1);
        } else {
            if(index < content.length) {
                setIndex(index => index + 1)
            }

            if(index >= content.length) {
                setIndex(0)
            }
            setSlideTime(720);
        }
    }

    if((index >= content.length || index < 0) && index != 0) {
        setIndex(0)
    }

    useEffect(() => {
        const slideTicker = setInterval(() => {updateSlide()}, 17);
        return () => clearInterval(slideTicker);
    }, [slideTime, index])

    const slideButtonClicked = (left: boolean) => {
        setSlideTime(720)
        if(left) {
            setIndex(index => index - 1)
        } else {
            setIndex(index => index + 1)
        }
    }

    const setSlide = (index: number) => {
        setSlideTime(720)
        setIndex(index);
    }
    return (
        <div className={styles.slideshow}>
            {content.map((f: IContentDoc, idx: number) => {
                return (
                    <div key={f._id} className={(index === idx) ? `${styles.slide} ${styles.active}` : `${styles.slide} ${styles.inactive}`}>
                        <Image className={styles.image_background} src={f.images[0]} width={1920} height={1080} alt=""></Image>

                        <img className={`${styles.nav_arrow} ${styles.left}`} src="/chev-left.svg" onClick={() => {slideButtonClicked(true)}}></img>
                        <img className={`${styles.nav_arrow} ${styles.right}`} src="/chev-right.svg" onClick={() => {slideButtonClicked(false)}}></img>

                        <div className={styles.information}>
                            <Image placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} priority={true} className={styles.image} src={f.images[0]} width={1920} height={1080} alt={t('Content.logo_alt', {title: f.title, type: f.type, minecraft_version: f.files[0].minecraftVersion, creator: f.creators[0].username})}></Image>

                            <div className={styles.text_information}>
                                <h2 className={styles.title}>{f.title}</h2>
                                <p className={styles.description}>{f.shortDescription}</p>
                                <p className={styles.author}>{t('Content.by', {creator: f.creators.slice(0, 5).map(c => c.username).join(t('Content.by_joiner'))})}</p>

                                <div className={styles.stats}>
                                    <div className={styles.stat}><img className={styles.in_text_icon} src='/download.svg'></img>{f.downloads}</div>
                                    {(f.rating > 0) ? <div className={styles.stat}><img className={styles.in_text_icon}  src='/star_white.svg'></img>{(Math.round(f.rating*100)/100) * 5}</div>: <></> }
                                    <div className={styles.stat}><img className={styles.in_text_icon}  src='/map.svg'></img>{f.files[0].minecraftVersion}</div>
                                </div>

                                <Link href={`/${f.type}s/${f.slug}`}><MainButton>{t('FeaturedSlideshow.see_more')}</MainButton></Link>
                                <div className={styles.markers}>
                                    {
                                        content.map((f: IContentDoc, idx: number) => {
                                            return (
                                                <div onClick={() => setSlide(idx)} key={f._id} className={(index === idx) ? `${styles.marker} ${styles.active}` : styles.marker}>
                                                    {index === idx ? (<span className={styles.color} style={{width: `${slideTime/10}px`}}></span>): (<span className={styles.color}></span>)} 
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
