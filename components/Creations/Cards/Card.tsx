'use client'

import { IContentDoc, NewFile } from "@/app/api/types"
import Image from "next/image"
import { Link } from "@/i18n/navigation";
import { shimmer, toBase64 } from "../../skeletons/imageShimmer"
import styles from './Card.module.css'
import { useRouter } from "next/navigation"
import InGridAdUnit from "../../AdUnits/InContent"
import { useEffect, useState } from "react"
import { convertToCollection, downloadCreation } from "@/app/api/content"
import { useLocale, useTranslations } from "use-intl";
import { useTags } from "@/app/api/hooks/creations";
import { makeSentenceCase } from "@/app/api/utils";
import { Button } from "../../ui/button";
import { Archive, CheckSquare, Download, Layers, Map, Package, Square, Star, Tag } from "lucide-react";
import { Badge } from "../../ui/badge";
import { track } from "@vercel/analytics/react";

export interface IContentCardProps {
    creation: IContentDoc
    playlist: string
    index: number
    priority: boolean,
    enableSelection?: boolean
    linkTo?: string
    adPosition?: number
    showCategory?: boolean
}

/**
 * A card for displaying content
 * @param content The content to display
 * @param playlist The playlist the content is in
 * @param index The index of the content in the playlist
 * @param priority Whether the image should be loaded with priority
 */
export default function CreationCard(props: IContentCardProps) {
    const [selected, setSelected] = useState(false)
    const t = useTranslations()
    const locale = useLocale();

    useEffect(() => {
        let selectedCreations = localStorage?.getItem('selectedCreations')
        if(selectedCreations) {
            let creations = JSON.parse(selectedCreations)
            if(props.creation.files && props.creation.files.length > 0) {
                if(creations.includes((props.creation.files[0].worldUrl) ? props.creation.files[0].worldUrl: (props.creation.files[0].dataUrl) ? props.creation.files[0].dataUrl : props.creation.files[0].resourceUrl!)) {
                    setSelected(true)
                }
            }
        }
    }, [])

    const selectCreation = (e: any) => {
        e.preventDefault(); 

        if(!selected) {
            let selectedMaps = localStorage?.getItem('selectedContent')
            if(selectedMaps) {
                let maps = JSON.parse(selectedMaps)
                maps.push((props.creation.files[0].worldUrl) ? props.creation.files[0].worldUrl: (props.creation.files[0].dataUrl) ? props.creation.files[0].dataUrl : props.creation.files[0].resourceUrl!)
                localStorage?.setItem('selectedContent', JSON.stringify(maps))
            } else {
                localStorage?.setItem('selectedContent', JSON.stringify([(props.creation.files[0].worldUrl) ? props.creation.files[0].worldUrl: (props.creation.files[0].dataUrl) ? props.creation.files[0].dataUrl : props.creation.files[0].resourceUrl!]))
            }
        } else {
            let selectedMaps = localStorage?.getItem('selectedContent')
            if(selectedMaps) {
                let maps = JSON.parse(selectedMaps)
                maps = maps.filter((map: string) => map !== ((props.creation.files[0].worldUrl) ? props.creation.files[0].worldUrl: (props.creation.files[0].dataUrl) ? props.creation.files[0].dataUrl : props.creation.files[0].resourceUrl!))
                localStorage?.setItem('selectedContent', JSON.stringify(maps))
            }
        
        }

        setSelected(!selected)
    }

    let shortDescription = props.creation.shortDescription
    let title = props.creation.title
    
    if(props.creation.translations && props.creation.translations[locale] && props.creation.translations[locale].approved) {
        shortDescription = props.creation.translations[locale].shortDescription
        title = props.creation.translations[locale].title
    }

    const downloadButtonClicked = async () => {
        let file = props.creation.files[0]
        await downloadCreation(props.creation.slug, convertToCollection(props.creation.type))
        let files: NewFile[] = [{url: file.url ?? file.worldUrl ?? file.dataUrl ?? file.resourceUrl ?? "", required: true, type: file.type}]
        file.extraFiles && files.push(...file.extraFiles)

        files.forEach((file) => {
            if(!file.required) return
            let a = document.createElement('a')
            a.href = file.url
            a.download = props.creation.slug
            a.target = '_blank'
            a.click()
            a.remove()
        })
    }

    let minecraftVersion = ""
    if(props.creation.files && props.creation.files.length > 0) {
        if(typeof props.creation.files[0].minecraftVersion === "string") {
            minecraftVersion = props.creation.files[0].minecraftVersion
        } else if(props.creation.files[0].minecraftVersion && props.creation.files[0].minecraftVersion.length > 0) {
            minecraftVersion = props.creation.files[0].minecraftVersion.filter((version: string) => version !== "").join(", ")
        } else {
            minecraftVersion = ""
        }
    }

    return (
        <>
        <div className="bg-card border-gray-950 border-2 card-shadow group transition-all duration-200 group-hover:bg-card-hover relative overflow-hidden" id={props.playlist + "_" + props.index} >
            <Link href={`/${(props.linkTo) ? props.linkTo : props.creation.type + "s"}/${props.creation.slug}`} onClick={() => {track("creation_card_logo_clicked", {playlist: props.playlist})}}>
            <div className="overflow-hidden aspect-video relative border-gray-950 border-b-2">
                    <Image priority={props.priority} placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1280, 720))}`} className="group-hover:scale-105 transition-all duration-200 border-b object-cover aspect-video" src={props.creation.images[0]} width={1280} height={720} sizes="25vw" alt={t('Components.Creations.Cards.logo_alt_text', {title: props.creation.title, type: props.creation.type, minecraft_version: minecraftVersion, creator: (props.creation.creators && props.creation.creators[0] && props.creation.creators[0].username) ? props.creation.creators[0].username : ""})}></Image>
                    <div className="absolute bottom-1 right-1 flex flex-row gap-1">
                        <Badge>{minecraftVersion}</Badge>
                        {
                            !props.showCategory && (
                                (props.creation.type === "map") ? <><Badge variant="secondary">{t('map', {count: 1})}</Badge></> : 
                                (props.creation.type === 'datapack') ? <><Badge variant="secondary">{t('datapack', {count: 1})}</Badge></> : 
                                <><Badge variant="secondary">{t('resourcepack', {count: 1})}</Badge></>) }
                            {props.showCategory && props.creation.tags && props.creation.tags.length > 0 && <>{props.creation.tags.slice(0, 2).map(tag => tag ? <Badge key={tag} variant="secondary">{t(`Components.Creations.Tags.${tag}`)}</Badge> : <></>)}</>}
                    </div>
                </div>
            </Link>
            <div className="p-2 mb-2">
                <Link href={`/${(props.linkTo) ? props.linkTo : props.creation.type + "s"}/${props.creation.slug}`} onClick={() => {track("creation_card_title_clicked", {playlist: props.playlist})}}><h2 className="mb-1">{title}</h2></Link>
                <div className="line-clamp-2 text-sm text-muted-foreground">
                    {shortDescription}
                </div>
                <div className={styles.stats}>
                    <div className={styles.stat}><Download className={styles.in_text_icon} />{props.creation.downloads}</div>
                    {(props.creation.rating > 0) ? <div className={styles.stat}><Star className={styles.in_text_icon} />{((Math.round(props.creation.rating*100)/100) * 5).toFixed(2)}</div>: <></> }
                </div>
                <p className={styles.author}>{t('Components.Creations.Cards.by', {creator: props.creation.creators.slice(0, 3).map(c => c.username).join(t('Components.Creations.Cards.by_joiner'))})}</p>
            </div>
        </div>
        {props.index === props.adPosition &&
            <InGridAdUnit />    }
        </>
    )
}