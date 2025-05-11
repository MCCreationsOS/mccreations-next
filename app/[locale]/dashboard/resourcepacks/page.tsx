'use client'

import { CollectionNames, IContentDoc, IUser } from "@/app/api/types";
import Table from "@/components/Dashboard/Table";
import {useTranslations} from 'next-intl';

export default function Page() {
    const t = useTranslations()
    return (
        <>
            <h3>{t('resourcepack', {count : 2})}</h3>
            <Table collectionName={CollectionNames.Resourcepacks}/>
        </>
    )
}