'use client'

import Link from "next/link";
import Image from "next/image";
import { Image as ImageIcon, Trash } from "react-feather";
import { Edit } from "react-feather";
import styles from './table.module.css'
import { ContentTypes, IContentDoc, IUser } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/app/api/auth";
import { deleteContent } from "@/app/api/content";

export default function Table({contentType}: {contentType: ContentTypes}) {
    const [maps, setMaps] = useState<IContentDoc[]>([])
    const [user, setUser] = useState<IUser>()
    const router = useRouter();
    const jwt = useRef<string | null>(null);

    useEffect(() => {

        jwt.current = sessionStorage.getItem('jwt')
        if(!jwt) {
            router.push('/signin')
            return;
        }
        getUserLocal(jwt.current + "")
    
    }, [])

    useEffect(() => {
        getOwnedContent(jwt.current)
    }, [user])

    const getUserLocal = async (jwt: string | undefined) => {
        let u = await getUser(undefined, jwt)
        if(!u) {
            router.push('/signin')
        }
        setUser(u)
    }

    const getOwnedContent = async (jwt: any) => {
        fetch(`${process.env.DATA_URL}/${contentType}-nosearch?status=0&limit=20&page=0&creator=${user?.handle}`, {
            headers: {
                authorization: jwt + ""
            }
        }).then((res) => {
            res.json().then((data) => {
                setMaps(data.documents)
            })
        })
    }
    
    return (
        <>
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
            {maps && maps.map((map: IContentDoc, idx) => (
                <div className={styles.content_item} key={map.slug}>
                    <div className={styles.content_item_item}>
                        <Image className={styles.logo} src={map.images[0]} width={160} height={90} alt=""></Image>
                    </div>
                    <div className={styles.info_container}>
                        <p className={styles.content_title}>{map.title}</p>
                        <p className={styles.content_description}>{map.shortDescription}</p>
                        <div className={styles.info_buttons}>
                            <Link href={`/${contentType.charAt(0).toLowerCase() + contentType.substring(1)}/${map.slug}`} title="Preview"><ImageIcon /></Link>
                            <Link href={`/${contentType.charAt(0).toLowerCase() + contentType.substring(1)}/${map.slug}/edit`} title="Edit"><Edit /></Link>
                            <span style={{color: 'red'}} onClick={() => {deleteContent(map._id, sessionStorage.getItem('jwt')); getOwnedContent(sessionStorage.getItem('jwt'))}}><Trash /></span>
                        </div>
                    </div>
                    <div className={styles.content_item_item}>
                        <p>{(map.status === 0) ? <span style={{color: "#c73030"}}>Draft</span> : (map.status === 1) ? <span style={{color: "#f0b432"}}>Awaiting Approval</span> : (map.status === 2) ? <span>Approved</span>: <span style={{color:"#3154f4"}}>Featured</span>}</p>
                    </div>
                    <div className={styles.content_item_item}>
                        <p>{map.createdDate && new Date(map.createdDate).toLocaleDateString()}</p>
                    </div>
                    <div className={styles.content_item_item}>
                        <p>{map.views}</p>
                    </div>
                    <div className={styles.content_item_item}>
                        <p>{map.downloads}</p>
                    </div>
                    <div className={styles.content_item_item}>
                        <p>{map.rating.toFixed(2)}</p>
                    </div>
                </div>
            ))}
        </>
    )
}