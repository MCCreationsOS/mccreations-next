'use client'

import { CollectionNames, IContentDoc, IUser } from "@/app/api/types";
import Menu from "@/components/Menu/Menu";
import Tabs from "@/components/Tabs/Tabs";
import Table from "@/components/Dashboard/Table";
import {useTranslations} from 'next-intl';

export default function Page() {
    const t = useTranslations()
    return (
        <>
        <Menu selectedPage="" />
        <h1 style={{marginLeft: "20px"}}>{t('Dashboard.title')}</h1>
        <Tabs tabs={[
            {
                content: <></>,
                title: t('map', {count:2}),
                link: '/dashboard/maps'
            },
            {
                content: <></>,
                title: t('datapack', {count:2}),
                link: '/dashboard/datapacks'
            },
            {
                content: <></>,
                title: t('resourcepack', {count:2}),
                link: '/dashboard/resourcepacks'
            }
        ]} preselectedTab={2}/>
        <Table collectionName={CollectionNames.Resourcepacks} />
        </>
    )
}