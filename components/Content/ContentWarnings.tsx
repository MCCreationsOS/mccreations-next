'use client'

import { getUser } from "@/app/api/auth"
import { ICreator, IContentDoc, IUser, UserTypes } from "@/app/api/types"
import { Link } from "@/app/api/navigation";
import { useEffect, useState } from "react"
import MessageComponent, { IMessage } from "../Message/Message"
import {useTranslations} from 'next-intl';

/**
 * Content warnings for the map creator(s)
 * @param map The map to check
 */
export default function ContentWarnings({map}: {map: IContentDoc}) {
    const [user, setUser] = useState<IUser>()
    const t = useTranslations()

    // Get the user on load
    useEffect(() => {
        let token = sessionStorage?.getItem('jwt')
        const getData = async () => {
            if(token) {
                let u = await getUser(undefined, token)
                setUser(u);
            }
        }
        getData();
    }, [])

    // Check if the user is a creator
    let match = false;
    map.creators && map.creators.forEach((creator) => {
        if(creator.handle && user && user.handle && (creator.handle === user?.handle || user.type === UserTypes.Admin)) {
            match = true
        }
    })
    if(match) {
        let messages: IMessage[] = []
        if(!map.creators || !map.creators[0].handle) {
            messages.push({
                type: 'Warning',
                title: t('content.warnings.not_linked.title'),
                message: t('content.warnings.not_linked.description')
            })
        }
        if(!map.shortDescription || map.shortDescription.length < 20) {
            messages.push({
                type: 'Error',
                title: t('content.warnings.short_description.title'),
                message: t('content.warnings.short_description.description')
            })
        }
        if(map.images.length === 0) {
            messages.push({
                type: 'Error',
                title: t('content.warnings.no_images.title'),
                message: t('content.warnings.no_images.description')
            })
        }
        if(map.description.length < 20) {
            messages.push({
                type: 'Error',
                title: t('content.warnings.description_too_short.title'),
                message: t('content.warnings.description_too_short.description')
            })
        }
        if(map.creators.length === 0) {
            messages.push({
                type: 'Error',
                title: t('content.warnings.no_creators.title'),
                message: t('content.warnings.no_creators.description')
            })
        }
        if(map.files && map.files[0] && (!map.files[0].minecraftVersion || map.files[0].minecraftVersion.length === 0)) {
            messages.push({
                type: 'Error',
                title: t('content.warnings.no_minecraft_version.title'),
                message: t('content.warnings.no_minecraft_version.description')
            })
        }
        if(!map.title || map.title.length === 0) {
            messages.push({
                type: 'Error',
                title: t('content.warnings.no_title.title'),
                message: t('content.warnings.no_title.description')
            })
        }
        if(!map.tags || map.tags.length === 0) {
            messages.push({
                type: 'Error',
                title: t('content.warnings.no_tags.title'),
                message: t('content.warnings.no_tags.description')
            })
        }
        if(!map.files || map.files.length === 0) {
            messages.push({
                type: 'Error',
                title: t('content.warnings.no_files.title'),
                message: t('content.warnings.no_files.description')
            })
        }

        if(map.images.length <= 2) {
            messages.push({
                type: 'Warning',
                title: t('content.warnings.few_images.title'),
                message: t('content.warnings.few_images.description')
            })
        }
        if(map.images.find(image => !image.includes('mccreations'))) {
            messages.push({
                type: 'Warning',
                title: t('content.warnings.external_images.title'),
                message: t('content.warnings.external_images.description')
            })
        }

        return (
            <MessageComponent messages={messages} />
        )
    }
    return (<></>)
}