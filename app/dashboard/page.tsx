'use client'

import Link from "next/link";
import { approveContent, fetchMaps } from "../api/content";
import { IMap } from "../types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "../api/auth";
import Menu from "@/components/Menu/Menu";
import Image from "next/image";
import { Image as ImageIcon } from "react-feather";
import { Edit } from "react-feather";
import styles from './dashboard.module.css'

export default function Page() {
    const [maps, setMaps] = useState<IMap[]>([])
    const router = useRouter();

    useEffect(() => {

        let jwt = sessionStorage.getItem('jwt')
        if(!jwt) {
            router.push('/signin')
            return;
        }
        getUser(undefined, jwt).then((user) => {
            if(!user) {
                router.push('/signin')
                return;
            }

            
        })

        fetchMaps({status: 0, search: "CrazyCowMM"}, false, jwt).then((maps) => {
            setMaps(maps.documents)
        })
    
    }, [])
    

    return (
        <>
        <Menu selectedPage="" />
        <h1 style={{marginLeft: "20px"}}>Your Content</h1>
        <div className={styles.content_item}>
                    <div className={styles.content_item_item}>
                    </div>
                    <div className={styles.info_container}>
                        <p>Info</p>
                    </div>
                    <div className={styles.content_item_item}>
                        <p>Status</p>
                    </div>
                    <div className={styles.content_item_item}>
                        <p>Created Date</p>
                    </div>
                    <div className={styles.content_item_item}>
                        <p>Views</p>
                    </div>
                    <div className={styles.content_item_item}>
                        <p>Downloads</p>
                    </div>
                    <div className={styles.content_item_item}>
                        <p>Rating</p>
                    </div>
                </div>
            {maps && maps.map((map: IMap) => (
                <div className={styles.content_item} key={map.slug}>
                    <div className={styles.content_item_item}>
                        <Image className={styles.logo} src={map.images[0]} width={160} height={90} alt=""></Image>
                    </div>
                    <div className={styles.info_container}>
                        <p className={styles.content_title}>{map.title}</p>
                        <p className={styles.content_description}>{map.shortDescription}</p>
                        <div className={styles.info_buttons}>
                            <Link href={`/maps/${map.slug}`} title="Preview"><ImageIcon /></Link>
                            <Link href={`/maps/${map.slug}/edit`} title="Edit"><Edit /></Link>
                        </div>
                    </div>
                    <div className={styles.content_item_item}>
                        <p>{(map.status === 0) ? <span style={{color: "#c73030"}}>Draft</span> : (map.status === 1) ? <span style={{color: "#f0b432"}}>Awaiting Approval</span> : (map.status === 2) ? <span>Approved</span>: <span style={{color:"#3154f4"}}>Featured</span>}</p>
                    </div>
                    <div className={styles.content_item_item}>
                        <p>{map.createdDate && new Date(map.createdDate).toDateString()}</p>
                    </div>
                    <div className={styles.content_item_item}>
                        <p>{map.views}</p>
                    </div>
                    <div className={styles.content_item_item}>
                        <p>{map.downloads}</p>
                    </div>
                    <div className={styles.content_item_item}>
                        <p>{map.rating}</p>
                    </div>
                </div>
            ))}
        </>
    )
}