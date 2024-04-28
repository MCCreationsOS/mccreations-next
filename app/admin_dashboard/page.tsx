'use client'

import Link from "next/link";
import { approveContent, fetchMap, fetchMaps, updateContent } from "../api/content";
import { IMap } from "../types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "../api/auth";
import Menu from "@/components/Menu/Menu";
import MainButton from "@/components/Buttons/MainButton";
import styles from './admin_dashbaord.module.css'
import { Plus } from "react-feather";

export default function Page() {
    const [maps, setMaps] = useState<IMap[]>([])
    const [page, setPage] = useState(0)
    const [updateQueue, setUpdateQueue] = useState<IMap[]>([])
    const router = useRouter();

    useEffect(() => {

        let jwt = sessionStorage.getItem('jwt')
        if(!jwt) {
            router.push('/signin')
            return;
        }
        getUser(undefined, jwt).then((user) => {
            if(!user || user.handle !== "crazycowmm") {
                router.push('/')
                return;
            }
        })

        fetch(`${process.env.DATA_URL}/old/maps?status=0&limit=20&page=${page}`, {
            headers: {
                authorization: jwt + ""
            }
        }).then((res) => {
            res.json().then((data) => {
                setMaps(data.documents)
            })
        })
    
    }, [])

    useEffect(() => {
        let jwt = sessionStorage.getItem('jwt')
        fetch(`${process.env.DATA_URL}/old/maps?status=0&limit=20&page=${page}`, {
            headers: {
                authorization: jwt + ""
            }
        }).then((res) => {
            res.json().then((data) => {
                setMaps(data.documents)
            })
        })
    }, [page])

    const update = async () => {
        updateQueue.forEach((map) => {
            updateContent(map, sessionStorage.getItem('jwt'), true)       
        })
        setUpdateQueue([])
    }

    return (
        <>
        <Menu selectedPage="" />
        <MainButton onClick={update}>Update</MainButton>
        <div className={`${styles.admin_table}`}>
            {updateQueue.map((map) => <span key={map.slug}>{map.title}</span>)}
            {maps && maps.map((map: IMap, idx) => (
                <div key={map.slug} className={styles.table_row}>
                    <Link href={`/maps/${map.slug}`}>View</Link>
                    <input type="text" className={styles.table_item} defaultValue={map.title}></input>
                    <input type="text" className={styles.table_item} defaultValue={map.slug}></input>
                    <input type="text" className={styles.table_item} defaultValue={map.tags}></input>
                    <textarea className={styles.table_item} defaultValue={map.shortDescription}></textarea>
                    <button onClick={() => {setUpdateQueue([...updateQueue, {
                        ...map,
                        title: (document.querySelectorAll('input')[(idx * 3)] as HTMLInputElement).value,
                        slug: (document.querySelectorAll('input')[(idx * 3) + 1] as HTMLInputElement).value,
                        tags: (document.querySelectorAll('input')[(idx * 3) + 2] as HTMLInputElement).value.split(','),
                        shortDescription: (document.querySelectorAll('textarea')[idx] as HTMLTextAreaElement).value
                    }])}}><Plus /></button>
                    {(map.status === 1) ? <MainButton onClick={() => {approveContent(map.slug, sessionStorage.getItem('jwt'))}}>Approve</MainButton> : <></> }
                </div>
            ))}
        </div>
        <button onClick={() => {setPage(page + 1)}}>Next</button>
        {page}
        <button onClick={() => {setPage(page - 1)}}>Previous</button>
        </>
    )
}