'use client'

import Link from "next/link";
import { approveContent, deleteContent, fetchMaps } from "../api/content";
import { IMap, IUser } from "../types";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "../api/auth";
import Menu from "@/components/Menu/Menu";
import Image from "next/image";
import { Image as ImageIcon, Trash } from "react-feather";
import { Edit } from "react-feather";
import styles from './dashboard.module.css'
import WarningButton from "@/components/Buttons/WarningButton";

export default function Page() {
    const [maps, setMaps] = useState<IMap[]>([])
    const [user, setUser] = useState<IUser>()
    const router = useRouter();
    let jwt: string | null = null;

    useEffect(() => {

        jwt = sessionStorage.getItem('jwt')
        if(!jwt) {
            router.push('/signin')
            return;
        }
        getUserLocal(jwt)
    
    }, [])

    useEffect(() => {
        getOwnedContent(jwt)
    }, [user])

    const getUserLocal = async (jwt: string | undefined) => {
        let u = await getUser(undefined, jwt)
        if(!u) {
            router.push('/signin')
        }
        console.log("Dashboard", u)
        setUser(u)
    }

    const getOwnedContent = async (jwt: any) => {
        fetch(`${process.env.DATA_URL}/maps-nosearch?status=0&limit=20&page=0&creator=${user?.handle}`, {
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
            {maps && maps.map((map: IMap, idx) => (
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
                            <span style={{color: 'red'}} onClick={() => {deleteContent(map._id, sessionStorage.getItem('jwt')); getOwnedContent(sessionStorage.getItem('jwt'))}}><Trash /></span>
                        </div>
                    </div>
                    <div className={styles.content_item_item}>
                        <p>{(map.status === 0) ? <span style={{color: "#c73030"}}>Draft</span> : (map.status === 1) ? <span style={{color: "#f0b432"}}>Awaiting Approval</span> : (map.status === 2) ? <span>Approved</span>: <span style={{color:"#3154f4"}}>Featured</span>}</p>
                    </div>
                    <div className={styles.content_item_item}>
                        <p>{map.createdDate && new Date(map.createdDate * 1000).toDateString()}</p>
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