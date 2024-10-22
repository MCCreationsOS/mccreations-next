'use client'
import { CollectionNames, UserTypes } from "../../api/types";
import { useRouter } from "next/navigation";
import Tabs from "@/components/Tabs/Tabs";
import ContentAdminTable from "@/components/Admin/ContentAdminTable";
import {useTranslations} from 'next-intl';
import CommentsAdminTable from "@/components/Admin/CommentsAdminTable";
import { useUserAlwaysSecure } from "@/app/api/hooks/users";
import Loading from "../loading";

export default function Page() {
    const {user, isLoading, error} = useUserAlwaysSecure()
    const router = useRouter();
    const t = useTranslations()

    if(isLoading) {
        return <Loading />
    }

    if(!user || user.type !== UserTypes.Admin) {
        router.push('/')
        return;
    }

    let jwt = localStorage?.getItem('jwt') + ""

    return (
        <>
        <Tabs tabs={[
            {
                content: <ContentAdminTable contentType={CollectionNames.Maps} jwt={jwt} />,
                title: t('map', {count: 2})
            },
            {
                content: <ContentAdminTable contentType={CollectionNames.Datapacks} jwt={jwt} />,
                title: t('datapack', {count: 2})
            },
            {
                content: <ContentAdminTable contentType={CollectionNames.Resourcepacks} jwt={jwt} />,
                title: t('resourcepack', {count: 2})
            },
            {
                content: <CommentsAdminTable jwt={jwt} />,
                title: t('comment', {count: 2})
            }
        ]} />
        </>
    )
}