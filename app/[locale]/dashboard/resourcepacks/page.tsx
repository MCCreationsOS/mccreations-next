'use client'

import { CollectionNames, IContentDoc, IUser } from "@/app/api/types";
import Menu from "@/components/Menu/Menu";
import Tabs from "@/components/Tabs/Tabs";
import Table from "@/components/Dashboard/Table";
import { useI18n } from "@/locales/client";

export default function Page() {
    const t = useI18n();
    return (
        <>
        <Menu selectedPage="" />
        <h1 style={{marginLeft: "20px"}}>{t('dashboard.title')}</h1>
        <Tabs tabs={[
            {
                content: <></>,
                title: t('maps', {count:2}),
                link: '/dashboard/maps'
            },
            {
                content: <></>,
                title: t('datapacks', {count:2}),
                link: '/dashboard/datapacks'
            },
            {
                content: <></>,
                title: t('resourcepacks', {count:2}),
                link: '/dashboard/resourcepacks'
            }
        ]} preselectedTab={2}/>
        <Table collectionName={CollectionNames.Resourcepacks} />
        </>
    )
}