'use client'
import { ContentTypes, UserTypes } from "../types";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "../api/auth";
import Menu from "@/components/Menu/Menu";
import Tabs from "@/components/Tabs/Tabs";
import AdminTable from "@/components/Admin/Table";

export default function Page() {
    const router = useRouter();

    useEffect(() => {

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
        })
    
    }, [])

    return (
        <>
        <Menu selectedPage="" />
        <Tabs tabs={[
            {
                content: <AdminTable contentType={ContentTypes.Maps} jwt={sessionStorage.getItem('jwt') + ""} />,
                title: "Maps"
            },
            {
                content: <AdminTable contentType={ContentTypes.Datapacks} jwt={sessionStorage.getItem('jwt') + ""} />,
                title: "Datapacks"
            },
            {
                content: <AdminTable contentType={ContentTypes.Resourcepacks} jwt={sessionStorage.getItem('jwt') + ""} />,
                title: "Resourcepacks"
            }
        ]} />
        </>
    )
}