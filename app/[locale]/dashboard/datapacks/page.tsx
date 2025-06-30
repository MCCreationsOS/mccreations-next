'use client'

import { CollectionNames } from "@/app/api/types";
import Table from "@/components/Dashboard/Dashboard";
import {useTranslations} from 'next-intl';

export default function Page() {
    const t = useTranslations()
    return (
        <>
            <h3>{t('datapack', {count : 2})}</h3>
            <Table collectionName={CollectionNames.Datapacks} />
        </>
    )
}