'use client'
import { CollectionNames, UserTypes } from "../../api/types";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Menu from "@/components/Menu/Menu";
import Tabs from "@/components/Tabs/Tabs";
import ContentAdminTable from "@/components/Admin/ContentAdminTable";
import { getUser } from "@/app/api/auth";
import {useTranslations} from 'next-intl';
import CommentsAdminTable from "@/components/Admin/CommentsAdminTable";

export default function Page() {
    const [jwt, setJwt] = useState("")
    const router = useRouter();
    const t = useTranslations()

    useEffect(() => {
        try {
            let jwt = localStorage.getItem('jwt')
            if(!jwt) {
                router.push('/signin')
                return;
            }
            getUser(jwt).then((user) => {
                if(!user || user.type !== UserTypes.Admin) {
                    router.push('/')
                    return;
                }
                setJwt(jwt + "")
            })
        } catch {
            router.push('/signin')
        }
    
    }, [])

    return (
        <>
        <Tabs tabs={[
            {
                content: <ContentAdminTable contentType={CollectionNames.Maps} jwt={jwt!} />,
                title: t('map', {count: 2})
            },
            {
                content: <ContentAdminTable contentType={CollectionNames.Datapacks} jwt={jwt!} />,
                title: t('datapack', {count: 2})
            },
            {
                content: <ContentAdminTable contentType={CollectionNames.Resourcepacks} jwt={jwt!} />,
                title: t('resourcepack', {count: 2})
            },
            {
                content: <CommentsAdminTable jwt={jwt!} />,
                title: t('comment', {count: 2})
            }
        ]} />
        </>
    )
}