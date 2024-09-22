'use client'

import { CollectionNames, IContentDoc, NewFile } from "@/app/api/types"
import Image from "next/image"
import { Link } from "@/app/api/navigation";
import { shimmer, toBase64 } from "../skeletons/imageShimmer"
import styles from './ContentCard.module.css'
import { useRouter } from "next/navigation"
import InContentAdUnit from "../AdUnits/InContent"
import IconButton from "../Buttons/IconButton"
import { Archive, Box, CheckSquare, Download, Layers, Map, Package, Square } from "react-feather"
import { useEffect, useState } from "react"
import { downloadMap } from "@/app/api/content"
import { useLocale, useTranslations } from "use-intl";

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
    const t = useTranslations()
    const locale = useLocale();

    useEffect(() => {
        let selectedMaps = localStorage.getItem('selectedContent')
        if(selectedMaps) {
            let maps = JSON.parse(selectedMaps)
            if(props.content.files && props.content.files.length > 0) {
                if(maps.includes((props.content.files[0].worldUrl) ? props.content.files[0].worldUrl: (props.content.files[0].dataUrl) ? props.content.files[0].dataUrl : props.content.files[0].resourceUrl!)) {
                    setSelected(true)
                }
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

    let shortDescription = props.content.shortDescription
    let title = props.content.title
    
    if(props.content.translations && props.content.translations[locale] && props.content.translations[locale].approved) {
        shortDescription = props.content.translations[locale].shortDescription
        title = props.content.translations[locale].title
    }

    const downloadButtonClicked = async () => {
        let file = props.content.files[0]
        await downloadMap(props.content.slug)
        let files: NewFile[] = [{url: file.url ?? file.worldUrl ?? file.dataUrl ?? file.resourceUrl ?? "", required: true, type: file.type}]
        file.extraFiles && files.push(...file.extraFiles)

        files.forEach((file) => {
            if(!file.required) return
            let a = document.createElement('a')
            a.href = file.url
            a.download = props.content.slug
            a.target = '_blank'
            a.click()
            a.remove()
        })
    }

    return (
        <>
        <div className={styles.content_card} id={props.playlist + "_" + props.index} >
            <div className={styles.information}>
                <div className={styles.description} onClick={() => {router.push(`/${(props.linkTo) ? props.linkTo : props.content.type + "s"}/${props.content.slug}`)}}>
                    {shortDescription}
                    <div className={styles.stats}>
                        <div className={styles.stat}><img className={styles.in_text_icon} src='/download.svg'></img>{props.content.downloads}</div>
                        {(props.content.rating > 0) ? <div className={styles.stat}><img className={styles.in_text_icon} src='/star_white.svg'></img>{(Math.round(props.content.rating*100)/100) * 5}</div>: <></> }
                        {(props.content.files && props.content.files.length > 0) ? <div className={styles.stat}><Map className={styles.in_text_icon} />{props.content.files[0].minecraftVersion}</div>: <></> }
                        <div className={styles.stat}>{(props.content.type === "map") ? <><Archive className={styles.in_text_icon} />{t('map', {count: 1})}</> : (props.content.type === 'datapack') ? <><Package className={styles.in_text_icon} />{t('datapack', {count: 1})}</> : <><Layers className={styles.in_text_icon} />{t('resourcepack', {count:1})}</>}</div>
                    </div>
                </div>
                <div className={styles.quick_actions}>
                    {(props.content.files && props.content.files.length > 0 && (props.content.files[0].worldUrl || props.content.files[0].dataUrl || props.content.files[0].resourceUrl || props.content.files[0].url)) ? <IconButton onClick={downloadButtonClicked}><Download/></IconButton> : <></>}
                    {props.enableSelection && <IconButton className="secondary" onClick={selectContent}>{(selected) ? <CheckSquare/> : <Square/>}</IconButton>}
                </div>
                <Image priority={props.priority} placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} className={styles.logo} src={props.content.images[0]} width={1920} height={1080} sizes="25vw" alt={t('Content.logo_alt', {title: props.content.title, type: props.content.type, minecraft_version: (props.content.files && props.content.files.length > 0) ? props.content.files[0].minecraftVersion : "", creator: props.content.creators[0].username})}></Image>
            </div>
            <Link className={styles.title} href={`/${(props.linkTo) ? props.linkTo : props.content.type + "s"}/${props.content.slug}`}>{title}</Link>
            <p className={styles.author}>{t('Content.by', {creator: props.content.creators.slice(0, 3).map(c => c.username).join(t('Content.by_joiner'))})}</p>
        </div>
        {props.index === props.adPosition &&
            <InContentAdUnit />    }
        </>
    )
}