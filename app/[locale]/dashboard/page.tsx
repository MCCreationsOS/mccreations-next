'use client'

import { CollectionNames} from "../../api/types";
import Table from "@/app/[locale]/dashboard/dashboardTable";
import {useTranslations} from 'next-intl';

export default function Page() {
    const t = useTranslations()
    return (
        <>
        <Table collectionName={CollectionNames.Maps}/>
        </>
    )
}