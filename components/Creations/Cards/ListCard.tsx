'use client'

import Image from "next/image"
import { Link } from "@/i18n/navigation";
import { shimmer, toBase64 } from "../../skeletons/imageShimmer"
import styles from './ListCard.module.css'
import { Archive, Download, Layers, Map, Package, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { formatRating, tagLabel } from "@/app/api/utils";
import { IContentCardProps } from "./Card";
import { Badge } from "../../ui/badge";
import { track } from "@vercel/analytics/react";

/**
 * A card for displaying content
 * @param content The content to display
 * @param playlist The playlist the content is in
 * @param index The index of the content in the playlist
 * @param priority Whether the image should be loaded with priority
 */
export default function CreationListCard(props: IContentCardProps) {
    const t = useTranslations()
    const locale = useLocale();

    let shortDescription = props.creation.shortDescription
    let title = props.creation.title

    if (props.creation.translations && props.creation.translations[locale] && props.creation.translations[locale].approved) {
        shortDescription = props.creation.translations[locale].shortDescription
        title = props.creation.translations[locale].title
    }

    let minecraftVersion = ""
    if (props.creation.files && props.creation.files.length > 0) {
        if (typeof props.creation.files[0].minecraftVersion === "string") {
            minecraftVersion = props.creation.files[0].minecraftVersion
        } else if (props.creation.files[0].minecraftVersion && props.creation.files[0].minecraftVersion.length > 0) {
            let versions = props.creation.files[0].minecraftVersion.filter((version: string) => version !== "")
            if (versions.length < 3) {
                minecraftVersion = versions.join(", ")
            } else {
                minecraftVersion = versions[0] + " - " + versions[versions.length - 1]
            }
        } else {
            minecraftVersion = ""
        }
    }

    return (
        <>
            <div className="bg-card group transition-all duration-200 group-hover:bg-card-hover overflow-hidden grid grid-cols-1 sm:grid-cols-[minmax(160px,295px)_1fr]" id={props.playlist + "_" + props.index} >
                <Link href={`/${(props.linkTo) ? props.linkTo : props.creation.type + "s"}/${props.creation.slug}`} onClick={() => { track("creation_card_logo_clicked", { playlist: props.playlist }) }}>
                    <div className="border-gray-950 border-2 border-r-0 overflow-hidden aspect-video relative">
                        <Image priority={props.priority} placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1280, 720))}`} className="group-hover:scale-105 transition-all duration-200 object-cover" src={props.creation.images && props.creation.images.length > 0 ? props.creation.images[0] : '/defaultBanner.png'} width={1280} height={720} sizes="25vw" alt={t('Components.Creations.Cards.logo_alt_text', { title: props.creation.title, type: props.creation.type, minecraft_version: minecraftVersion, creator: (props.creation.creators && props.creation.creators[0] && props.creation.creators[0].username) ? props.creation.creators[0].username : "" })}></Image>
                        <div className="absolute bottom-1 right-1 flex flex-row gap-1">
                            <Badge>{minecraftVersion}</Badge>
                            {
                                !props.showCategory && (
                                    (props.creation.type === "map") ? <><Badge variant="secondary">{t('map', { count: 1 })}</Badge></> :
                                        (props.creation.type === 'datapack') ? <><Badge variant="secondary">{t('datapack', { count: 1 })}</Badge></> :
                                            <><Badge variant="secondary">{t('resourcepack', { count: 1 })}</Badge></>)}
                            {props.showCategory && props.creation.tags && props.creation.tags.length > 0 && <>{props.creation.tags.filter(tag => tag).slice(0, 2).map(tag => <Badge key={tag} variant="secondary">{tagLabel(t, tag)}</Badge>)}</>}
                        </div>
                    </div>
                </Link>
                <div className="flex flex-col gap-1 p-2 border-gray-950 border-2 card-shadow relative">
                    <div className={styles.title_container}>
                        <Link href={`/${(props.linkTo) ? props.linkTo : props.creation.type + "s"}/${props.creation.slug}`} onClick={() => { track("creation_card_title_clicked", { playlist: props.playlist }) }}><h2 className="mb-1">{title}</h2></Link>
                        <div className={styles.stats}>
                            <div className={styles.stat}><Download className={styles.in_text_icon} />{props.creation.downloads}</div>
                            {(props.creation.rating > 0) ? <div className={styles.stat}><Star className={styles.in_text_icon} />{formatRating(props.creation.rating)}</div> : <></>}
                            {(props.creation.files && props.creation.files.length > 0) ? <div className={styles.stat}><Map className={styles.in_text_icon} />{minecraftVersion}</div> : <></>}
                        </div>
                    </div>
                    <div className="line-clamp-2 text-sm text-muted-foreground">
                        {shortDescription}
                    </div>
                    <div className={styles.stat}>
                        {!props.showCategory && (
                            (props.creation.type === "map") ? <><Archive className={styles.in_text_icon} />{t('map', { count: 1 })}</> :
                                (props.creation.type === 'datapack') ? <><Package className={styles.in_text_icon} />{t('datapack', { count: 1 })}</> :
                                    <><Layers className={styles.in_text_icon} />{t('resourcepack', { count: 1 })}</>)}
                    </div>
                    <p className={styles.author}>{t('Components.Creations.Cards.by', { creator: props.creation.creators.slice(0, 3).map(c => c.username).join(t('Components.Creations.Cards.by_joiner')) })}</p>
                </div>
            </div>
        </>
    )
}