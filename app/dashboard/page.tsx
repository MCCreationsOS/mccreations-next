'use client'

import { ContentTypes, IContentDoc, IUser } from "../types";
import Menu from "@/components/Menu/Menu";
import Tabs from "@/components/Tabs/Tabs";
import Table from "@/components/Dashboard/Table";

export default function Page() {
    return (
        <>
        <Menu selectedPage="" />
        <h1 style={{marginLeft: "20px"}}>Your Content</h1>
        <Tabs tabs={[
            {
                content: <></>,
                title: "Maps",
                link: '/dashboard/maps'
            },
            {
                content: <></>,
                title: "Datapacks",
                link: '/dashboard/datapacks'
            },
            {
                content: <></>,
                title: "Resourcepacks",
                link: '/dashboard/resourcepacks'
            }
        ]} />
        <Table contentType={ContentTypes.Maps} />
        </>
    )
}