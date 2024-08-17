'use client'
import { ContentTypes, UserTypes } from "../../api/types";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Menu from "@/components/Menu/Menu";
import Tabs from "@/components/Tabs/Tabs";
import ContentAdminTable from "@/components/Admin/ContentAdminTable";
import { getUser } from "@/app/api/auth";
import { useI18n } from "@/locales/client";
import CommentsAdminTable from "@/components/Admin/CommentsAdminTable";

export default function Page() {
    const [jwt, setJwt] = useState("")
    const router = useRouter();
    const t = useI18n();

    useEffect(() => {
        try {
            let jwt = sessionStorage.getItem('jwt')
            if(!jwt) {
                router.push('/signin')
                return;
            }
            getUser(undefined, jwt).then((user) => {
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
        <Menu selectedPage="" />
        <Tabs tabs={[
            {
                content: <ContentAdminTable contentType={ContentTypes.Maps} jwt={jwt!} />,
                title: t('maps', {count: 2})
            },
            {
                content: <ContentAdminTable contentType={ContentTypes.Datapacks} jwt={jwt!} />,
                title: t('datapacks', {count: 2})
            },
            {
                content: <ContentAdminTable contentType={ContentTypes.Resourcepacks} jwt={jwt!} />,
                title: t('resourcepacks', {count: 2})
            },
            {
                content: <CommentsAdminTable jwt={jwt!} />,
                title: t('comments', {count: 2})
            }
        ]} />
        </>
    )
}