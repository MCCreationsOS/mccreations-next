'use client'
import { ContentTypes, UserTypes } from "../types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "../api/auth";
import Menu from "@/components/Menu/Menu";
import Tabs from "@/components/Tabs/Tabs";
import AdminTable from "@/components/Admin/Table";

export default function Page() {
    const [jwt, setJwt] = useState("")
    const router = useRouter();

    useEffect(() => {
        try {
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
                setJwt(jwt + "")
            })
        } catch {
            router.push('/signin')
        }
    
    }, [])

    return (
        <>
        <Menu selectedPage="" />
        <Tabs tabs={[
            {
                content: <AdminTable contentType={ContentTypes.Maps} jwt={jwt!} />,
                title: "Maps"
            },
            {
                content: <AdminTable contentType={ContentTypes.Datapacks} jwt={jwt!} />,
                title: "Datapacks"
            },
            {
                content: <AdminTable contentType={ContentTypes.Resourcepacks} jwt={jwt!} />,
                title: "Resourcepacks"
            }
        ]} />
        </>
    )
}