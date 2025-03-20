'use client'

import { UserTypes, ContentTypes } from "@/app/api/types"
import MessageComponent, { IMessage } from "../Message/Message"
import {useTranslations} from 'next-intl';
import { useUser } from "@/app/api/hooks/users";
import { useCreation } from "@/app/api/hooks/creations";

/**
 * Content warnings for the map creator(s)
 * @param map The map to check
 */
export default function ContentWarnings({slug, contentType}: {slug: string, contentType: ContentTypes}) {
    const { creation } = useCreation(slug, contentType)
    const {user} = useUser()
    const t = useTranslations()

    if(!creation || 'error' in creation) return null;
    // Check if the user is a creator
    let match = false;
    creation.creators && creation.creators.forEach((creator) => {
        if(creator.handle && user && user.handle && (creator.handle === user?.handle || user.type === UserTypes.Admin)) {
            match = true
        }
    })
    if(match) {
        let messages: IMessage[] = []
        let hasOwner = creation.owner && creation.owner.length > 0
        creation.creators.forEach((creator) => {
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
        if(!creation.shortDescription || creation.shortDescription.length < 20) {
            messages.push({
                type: 'Error',
                title: t('Content.Warnings.no_short_description.title'),
                message: t('Content.Warnings.no_short_description.description')
            })
        }
        if(creation.images.length === 0) {
            messages.push({
                type: 'Error',
                title: t('Content.Warnings.no_images.title'),
                message: t('Content.Warnings.no_images.description')
            })
        }
        if(creation.description.length < 20) {
            messages.push({
                type: 'Error',
                title: t('Content.Warnings.description_too_short.title'),
                message: t('Content.Warnings.description_too_short.description')
            })
        }
        if(creation.creators.length === 0) {
            messages.push({
                type: 'Error',
                title: t('Content.Warnings.no_creators.title'),
                message: t('Content.Warnings.no_creators.description')
            })
        }
        if(creation.files && creation.files[0] && (!creation.files[0].minecraftVersion || creation.files[0].minecraftVersion.length === 0)) {
            messages.push({
                type: 'Error',
                title: t('Content.Warnings.no_minecraft_version.title'),
                message: t('Content.Warnings.no_minecraft_version.description')
            })
        }
        if(!creation.title || creation.title.length === 0) {
            messages.push({
                type: 'Error',
                title: t('Content.Warnings.no_title.title'),
                message: t('Content.Warnings.no_title.description')
            })
        }
        if(!creation.tags || creation.tags.length === 0) {
            messages.push({
                type: 'Error',
                title: t('Content.Warnings.no_tags.title'),
                message: t('Content.Warnings.no_tags.description')
            })
        }
        if(!creation.files || creation.files.length === 0) {
            messages.push({
                type: 'Error',
                title: t('Content.Warnings.no_files.title'),
                message: t('Content.Warnings.no_files.description')
            })
        }

        if(creation.images.length <= 2) {
            messages.push({
                type: 'Warning',
                title: t('Content.Warnings.few_images.title'),
                message: t('Content.Warnings.few_images.description')
            })
        }
        if(creation.images.find(image => !image.includes('mccreations'))) {
            messages.push({
                type: 'Warning',
                title: t('Content.Warnings.external_images.title'),
                message: t('Content.Warnings.external_images.description')
            })
        }

        if(messages.length > 0) {
            return (
                <MessageComponent messages={messages} />
            )
        }
    }
    return (<></>)
}