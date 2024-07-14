'use client'

import { getUser } from "@/app/api/auth";
import { getCreator } from "@/app/api/community";
import { ICreator, IUser } from "@/app/api/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import MainButton from "./MainButton";
import { useI18n } from "@/locales/client";

/**
 * The Edit Content button, which displays if the user is a creator of the content
 * @param slug The slug of the content
 * @param creators The creators of the content
 * @param status The status of the content 
 */
export default function EditContentButton({slug, creators, status}: {slug: string, creators: ICreator[], status: number}) {
    const [user, setUser] = useState<IUser>()
    const t = useI18n();
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
            <Link href={`./${slug}/edit`}><MainButton>{t('content.edit')}</MainButton></Link>
        )
    }
    return (<></>)
}