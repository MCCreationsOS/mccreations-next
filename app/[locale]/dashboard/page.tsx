'use client'

import { CollectionNames, IContentDoc, IUser } from "../../api/types";
import Menu from "@/components/Menu/Navbar";
import Tabs from "@/components/Tabs/Tabs";
import Table from "@/components/Dashboard/Table";
import {useTranslations} from 'next-intl';

export default function Page() {
    const t = useTranslations()
    return (
        <>
        <Table collectionName={CollectionNames.Maps} />
        </>
    )
}