'use client'

import { IContentDoc } from "@/app/api/types"
import Image from "next/image"
import { Link } from "@/i18n/navigation";
import { shimmer, toBase64 } from "../../skeletons/imageShimmer"
import styles from './Card.module.css'
import { useLocale, useTranslations } from "next-intl";
import { formatRating, tagLabel } from "@/app/api/utils";
import { Download, Star } from "lucide-react";
import { Badge } from "../../ui/badge";
import { track } from "@vercel/analytics/react";

export interface IContentCardProps {
    creation: IContentDoc
    playlist: string
    index: number
    priority: boolean,
    linkTo?: string
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
            <Link href={`/${(props.linkTo) ? props.linkTo : props.creation.type + "s"}/${props.creation.slug}`} className="group">
                <div className="bg-card border-gray-950 border-2 card-shadow group transition-all duration-200 group-hover:bg-card-hover relative overflow-hidden" id={props.playlist + "_" + props.index} >
                    <div className="overflow-hidden aspect-video relative border-gray-950 border-b-2">
                        <Image priority={props.priority} placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1280, 720))}`} className="group-hover:scale-105 transition-all duration-200 border-b object-cover aspect-video w-full" src={props.creation.images && props.creation.images.length > 0 ? props.creation.images[0] : '/defaultBanner.png'} width={480} height={270} quality={50} alt={t('Components.Creations.Cards.logo_alt_text', { title: props.creation.title, type: props.creation.type, minecraft_version: minecraftVersion, creator: (props.creation.creators && props.creation.creators[0] && props.creation.creators[0].username) ? props.creation.creators[0].username : "" })}></Image>
                        <div className="absolute bottom-1 right-1 flex flex-row gap-1">
                            <Badge>{minecraftVersion}</Badge>
                            { !props.showCategory && (
                                (props.creation.type === "map") ? <><Badge variant="secondary">{t('map', { count: 1 })}</Badge></> :
                                (props.creation.type === 'datapack') ? <><Badge variant="secondary">{t('datapack', { count: 1 })}</Badge></> :
                                <><Badge variant="secondary">{t('resourcepack', { count: 1 })}</Badge></>)}
                                {props.showCategory && props.creation.tags && props.creation.tags.length > 0 && <>{props.creation.tags.filter(tag => tag).slice(0, 2).map(tag => <Badge key={tag} variant="secondary">{tagLabel(t, tag)}</Badge>)}</>}
                        </div>
                    </div>
                    <div className="p-2 mb-2">
                        <h2 className="mb-1">{title}</h2>
                        <div className="line-clamp-2 text-sm text-muted-foreground">
                            {shortDescription}
                        </div>
                        <div className={styles.stats}>
                            <div className={styles.stat}><Download className={styles.in_text_icon} />{props.creation.downloads}</div>
                            {(props.creation.rating > 0) ? <div className={styles.stat}><Star className={styles.in_text_icon} />{formatRating(props.creation.rating)}</div> : <></>}
                        </div>
                        <p className={styles.author}>{t('Components.Creations.Cards.by', { creator: props.creation.creators.slice(0, 3).map(c => c.username).join(t('Components.Creations.Cards.by_joiner')) })}</p>
                    </div>
                </div>
            </Link>
        </>
    )
}