'use client'

import { IContentDoc } from "@/app/types"
import Image from "next/image"
import Link from "next/link"
import { shimmer, toBase64 } from "../skeletons/imageShimmer"
import styles from './ContentCard.module.css'
import { useRouter } from "next/navigation"
import InContentAdUnit from "../AdUnits/InContent"
import IconButton from "../Buttons/IconButton"
import { Box, CheckSquare, Download, Square } from "react-feather"
import { useEffect, useState } from "react"

export interface IContentCardProps {
    content: IContentDoc
    playlist: string
    index: number
    priority: boolean,
    enableSelection?: boolean
    linkTo?: string
    adPosition?: number
}

/**
 * A card for displaying content
 * @param content The content to display
 * @param playlist The playlist the content is in
 * @param index The index of the content in the playlist
 * @param priority Whether the image should be loaded with priority
 */
export default function ContentCard(props: IContentCardProps) {
    const [selected, setSelected] = useState(false)
    const router = useRouter()

    useEffect(() => {
        let selectedMaps = localStorage.getItem('selectedContent')
        if(selectedMaps) {
            let maps = JSON.parse(selectedMaps)
            if(maps.includes((props.content.files[0].worldUrl) ? props.content.files[0].worldUrl: (props.content.files[0].dataUrl) ? props.content.files[0].dataUrl : props.content.files[0].resourceUrl!)) {
                setSelected(true)
            }
        }
    }, [])

    const selectContent = (e: any) => {
        e.preventDefault(); 

        if(!selected) {
            let selectedMaps = localStorage.getItem('selectedContent')
            if(selectedMaps) {
                let maps = JSON.parse(selectedMaps)
                maps.push((props.content.files[0].worldUrl) ? props.content.files[0].worldUrl: (props.content.files[0].dataUrl) ? props.content.files[0].dataUrl : props.content.files[0].resourceUrl!)
                localStorage.setItem('selectedContent', JSON.stringify(maps))
            } else {
                localStorage.setItem('selectedContent', JSON.stringify([(props.content.files[0].worldUrl) ? props.content.files[0].worldUrl: (props.content.files[0].dataUrl) ? props.content.files[0].dataUrl : props.content.files[0].resourceUrl!]))
            }
        } else {
            let selectedMaps = localStorage.getItem('selectedContent')
            if(selectedMaps) {
                let maps = JSON.parse(selectedMaps)
                maps = maps.filter((map: string) => map !== ((props.content.files[0].worldUrl) ? props.content.files[0].worldUrl: (props.content.files[0].dataUrl) ? props.content.files[0].dataUrl : props.content.files[0].resourceUrl!))
                localStorage.setItem('selectedContent', JSON.stringify(maps))
            }
        
        }

        setSelected(!selected)
    }

    return (
        <>
        <div className={styles.content_card} id={props.playlist + "_" + props.index} >
            <div className={styles.information}>
                <div className={styles.description} onClick={() => {router.push(`/${(props.linkTo) ? props.linkTo : "maps"}/${props.content.slug}`)}}>
                    {props.content.shortDescription}
                    <div className={styles.stats}>
                        <div className={styles.stat}><img className={styles.in_text_icon} src='/download.svg'></img>{props.content.downloads}</div>
                        {(props.content.rating > 0) ? <div className={styles.stat}><img className={styles.in_text_icon} src='/star_white.svg'></img>{(Math.round(props.content.rating*100)/100) * 5}</div>: <></> }
                        {(props.content.files && props.content.files.length > 0) ? <div className={styles.stat}><img className={styles.in_text_icon} src='/map.svg'></img>{props.content.files[0].minecraftVersion}</div>: <></> }
                    </div>
                </div>
                <div className={styles.quick_actions}>
                    {(props.content.files[0].worldUrl || props.content.files[0].dataUrl || props.content.files[0].resourceUrl) ? <Link target="_blank" href={(props.content.files[0].worldUrl) ? props.content.files[0].worldUrl: (props.content.files[0].dataUrl) ? props.content.files[0].dataUrl : props.content.files[0].resourceUrl!} title="Quick Download Latest Version"><IconButton><Download /></IconButton></Link> : <></>}
                    {props.enableSelection && <IconButton className="secondary" onClick={selectContent}>{(selected) ? <CheckSquare/> : <Square/>}</IconButton>}
                </div>
                <Image priority={props.priority} placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} className={styles.logo} src={props.content.images[0]} width={1920} height={1080} sizes="25vw" alt={`The logo for ${props.content.title}, a Minecraft Map for ${(props.content.files && props.content.files.length > 0) ? props.content.files[0].minecraftVersion : ""} by ${props.content.creators[0].username}`}></Image>
            </div>
            <Link className={styles.title} href={`/${(props.linkTo) ? props.linkTo : "maps"}/${props.content.slug}`}>{props.content.title}</Link>
            <p className={styles.author}>by <span className='cardAuthorLink'>{props.content.creators[0].username}</span></p>
        </div>
        {props.index === props.adPosition &&
            <InContentAdUnit />    }
        </>
    )
}