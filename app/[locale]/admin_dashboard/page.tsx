'use client'
import { CollectionNames, Locales, UserTypes } from "../../api/types";
import { useRouter } from "next/navigation";
import Tabs from "@/components/Tabs/Tabs";
import ContentAdminTable from "@/components/Admin/ContentAdminTable";
import {useTranslations} from 'next-intl';
import CommentsAdminTable from "@/components/Admin/CommentsAdminTable";
import { useToken, useUserAlwaysSecure } from "@/app/api/hooks/users";
import Loading from "../loading";
import MainButton from "@/components/Buttons/MainButton";
import { approveLanguage } from "@/app/api/translation";

export default function Page() {
    const {user, isLoading, error} = useUserAlwaysSecure()
    const {token} = useToken()
    const router = useRouter();
    const t = useTranslations()

    if(isLoading) {
        return <Loading />
    }

    if(!user || user.type !== UserTypes.Admin) {
        router.push('/')
        return;
    }

    return (
        <>
        <Tabs tabs={[
            {
                content: <ContentAdminTable contentType={CollectionNames.Maps} jwt={token} />,
                title: t('map', {count: 2})
            },
            {
                content: <ContentAdminTable contentType={CollectionNames.Datapacks} jwt={token} />,
                title: t('datapack', {count: 2})
            },
            {
                content: <ContentAdminTable contentType={CollectionNames.Resourcepacks} jwt={token} />,
                title: t('resourcepack', {count: 2})
            },
            {
                content: <CommentsAdminTable jwt={token} />,
                title: t('comment', {count: 2})
            },
            {
                content: <>{Locales.map(locale => <div key={locale}>{locale} <MainButton onClick={() => approveLanguage(locale)}>Approve</MainButton></div>)}</>,
                title: t('translation')
            }
        ]} />
        </>
    )
}