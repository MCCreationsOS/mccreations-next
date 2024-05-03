'use client'

import { IMap } from "@/app/types";
import ContentCard from "./ContentCard";
import styles from './ContentSlideshow.module.css'
import { useEffect, useState } from "react";

/**
 * A slideshow of content cards
 * @param content The content to display
 * @param playlist The playlist to display
 */
export default function ContentSlideshow({content, playlist}: {content: IMap[], playlist: string}) {
    const [adPosition, setAdPosition] = useState(-1)
    let location = 0
    const slideButtonClicked = (left: boolean) => {
        let elem
        // This should be improve to be more dynamic ad support slideshows of any length
        if(left) {
            if(location > 0) location -= 4
            elem = document.querySelector(`#${playlist}_${location}`)
        } else {
            if(location < 16) location += 4
            elem = document.querySelector(`#${playlist}_${location}`)
        }
        console.log(elem)
        elem?.scrollIntoView({behavior: "smooth", inline: "start", block: "center"})
        setTimeout(() => {window.scrollBy(0, 1)}, 1000)
    }

    useEffect(() => {
        setAdPosition(Math.floor(Math.random() * 15) + 2)
    }, [])

    return (
        <div className={styles.slideshow}>
            <img className={`${styles.nav_arrow} ${styles.left}`}  src="/chev-left.svg" onClick={() => {slideButtonClicked(true)}}></img>
            <img className={`${styles.nav_arrow} ${styles.right}`} src="/chev-right.svg" onClick={() => {slideButtonClicked(false)}}></img>
            <div className={styles.scroll_window} id={playlist}>
                {content.map((map: IMap, idx: number) => <ContentCard key={idx} content={map} playlist={playlist} index={idx} priority={true} adPosition={adPosition}></ContentCard>)}
            </div>
        </div>
    )
}