'use client'

import { getUser, useUserStore } from "@/app/api/auth";
import { getCreator } from "@/app/api/community";
import { ContentTypes, ICreator, IUser } from "@/app/api/types";
import { Link } from "@/app/api/navigation";
import MainButton from "./MainButton";
import {useTranslations} from 'next-intl';
import { useUser } from "@/app/api/hooks/users";

/**
 * The Edit Content button, which displays if the user is a creator of the content
 * @param slug The slug of the content
 * @param creators The creators of the content
 * @param status The status of the content 
 */
export default function EditContentButton({slug, creators, status, contentType}: {slug: string, creators: ICreator[], status: number, contentType: ContentTypes}) {
    const {user} = useUser()
    const t = useTranslations()

    let match = false;
    creators && creators.forEach((creator) => {
        if(creator.handle && user && user.handle && creator.handle === user?.handle) {
            match = true
        }
    })
    // If the user made it to a page with status 0 we can assume they are the creator.
    if(status === 0) match = true

    if(match) {
        return (
            <Link href={`/edit/${contentType}/${slug}`}><MainButton>{t('Buttons.edit')}</MainButton></Link>
        )
    }
    return (<></>)
}