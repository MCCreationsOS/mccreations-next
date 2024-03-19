'use client'

import Link from "next/link";
import { approveContent, fetchMaps } from "../api/content";
import { IMap } from "../types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "../api/auth";
import Menu from "@/components/Menu";

export default function Page() {
    const [maps, setMaps] = useState<IMap[]>([])
    const router = useRouter();

    useEffect(() => {

        let jwt = sessionStorage.getItem('jwt')
        if(!jwt) {
            router.push('/login')
            return;
        }
        getUser(undefined, jwt).then((user) => {
            if(!user || user.handle !== "crazycowmm") {
                router.push('/')
                return;
            }
        })

        fetchMaps({status: 1, exclusiveStatus: true}, false).then((maps) => {
            setMaps(maps.documents)
        })
    
    }, [])

    return (
        <>
        <Menu selectedPage="" />
        <div className="centered_content">
            {maps && maps.map((map: IMap) => (
                <div key={map.slug}>
                    <h2>{map.title}</h2>
                    <p>{map.shortDescription}</p>
                    <Link href={`/maps/${map.slug}`}>View</Link>
                    <button className="main_button" onClick={() => {approveContent(map.slug, sessionStorage.getItem('jwt'))}}>Approve</button>
                </div>
            ))}
        </div>
        </>
    )
}