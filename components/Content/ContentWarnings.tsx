'use client'

import { getUser, useUserStore } from "@/app/api/auth"
import { ICreator, IContentDoc, IUser, UserTypes } from "@/app/api/types"
import { Link } from "@/app/api/navigation";
import { useEffect, useState } from "react"
import MessageComponent, { IMessage } from "../Message/Message"
import {useTranslations} from 'next-intl';
import { useUser } from "@/app/api/hooks/users";

/**
 * Content warnings for the map creator(s)
 * @param map The map to check
 */
export default function ContentWarnings({map}: {map: IContentDoc}) {
    const {user} = useUser()
    const t = useTranslations()


    // Check if the user is a creator
    let match = false;
    map.creators && map.creators.forEach((creator) => {
        if(creator.handle && user && user.handle && (creator.handle === user?.handle || user.type === UserTypes.Admin)) {
            match = true
        }
    })
    if(match) {
        let messages: IMessage[] = []
        let hasOwner = map.owner && map.owner.length > 0
        map.creators.forEach((creator) => {
            if(creator.handle && user && user.handle && (creator.handle === user?.handle || user.type === UserTypes.Admin)) {
                hasOwner = true
            }
        })
        if(!hasOwner) {
            messages.push({
                type: 'Warning',
                title: t('Content.Warnings.not_linked.title'),
                message: t('Content.Warnings.not_linked.description')
            })
        }
        if(!map.shortDescription || map.shortDescription.length < 20) {
            messages.push({
                type: 'Error',
                title: t('Content.Warnings.short_description.title'),
                message: t('Content.Warnings.short_description.description')
            })
        }
        if(map.images.length === 0) {
            messages.push({
                type: 'Error',
                title: t('Content.Warnings.no_images.title'),
                message: t('Content.Warnings.no_images.description')
            })
        }
        if(map.description.length < 20) {
            messages.push({
                type: 'Error',
                title: t('Content.Warnings.description_too_short.title'),
                message: t('Content.Warnings.description_too_short.description')
            })
        }
        if(map.creators.length === 0) {
            messages.push({
                type: 'Error',
                title: t('Content.Warnings.no_creators.title'),
                message: t('Content.Warnings.no_creators.description')
            })
        }
        if(map.files && map.files[0] && (!map.files[0].minecraftVersion || map.files[0].minecraftVersion.length === 0)) {
            messages.push({
                type: 'Error',
                title: t('Content.Warnings.no_minecraft_version.title'),
                message: t('Content.Warnings.no_minecraft_version.description')
            })
        }
        if(!map.title || map.title.length === 0) {
            messages.push({
                type: 'Error',
                title: t('Content.Warnings.no_title.title'),
                message: t('Content.Warnings.no_title.description')
            })
        }
        if(!map.tags || map.tags.length === 0) {
            messages.push({
                type: 'Error',
                title: t('Content.Warnings.no_tags.title'),
                message: t('Content.Warnings.no_tags.description')
            })
        }
        if(!map.files || map.files.length === 0) {
            messages.push({
                type: 'Error',
                title: t('Content.Warnings.no_files.title'),
                message: t('Content.Warnings.no_files.description')
            })
        }

        if(map.images.length <= 2) {
            messages.push({
                type: 'Warning',
                title: t('Content.Warnings.few_images.title'),
                message: t('Content.Warnings.few_images.description')
            })
        }
        if(map.images.find(image => !image.includes('mccreations'))) {
            messages.push({
                type: 'Warning',
                title: t('Content.Warnings.external_images.title'),
                message: t('Content.Warnings.external_images.description')
            })
        }

        return (
            <MessageComponent messages={messages} />
        )
    }
    return (<></>)
}