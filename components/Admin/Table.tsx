'use client'

import { approveContent, updateContent } from "@/app/api/content";
import { ContentTypes, IContentDoc } from "@/app/types"
import { useEffect, useState } from "react";
import MainButton from "../Buttons/MainButton";
import styles from './table.module.css'
import Link from "next/link";
import { Plus, RefreshCw } from "react-feather";
import IconButton from "../Buttons/IconButton";

export default function AdminTable({contentType, jwt}: {contentType: ContentTypes, jwt: string}) {
    const [maps, setMaps] = useState<IContentDoc[]>([])
    const [page, setPage] = useState(0)
    const [updateQueue, setUpdateQueue] = useState<IContentDoc[]>([])

    useEffect(() => {

        fetch(`${process.env.DATA_URL}/${contentType}-nosearch?status=0&limit=20&page=${page}`, {
            headers: {
                authorization: jwt + ""
            }
        }).then((res) => {
            res.json().then((data) => {
                console.log(data.documents)
                setMaps(data.documents)
            })
        })
    
    }, [])

    useEffect(() => {
        let jwt = sessionStorage.getItem('jwt')
        fetch(`${process.env.DATA_URL}/${contentType}-nosearch?status=0&limit=20&page=${page}`, {
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
            updateContent(map, sessionStorage.getItem('jwt'), contentType, true)       
        })
        setUpdateQueue([])
    }

    const refresh = () => {
        let jwt = sessionStorage.getItem('jwt')
        fetch(`${process.env.DATA_URL}/${contentType}-nosearch?status=0&limit=20&page=${page}`, {
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
        <div>
            <MainButton onClick={update}>Update {contentType}</MainButton><IconButton onClick={refresh}><RefreshCw /></IconButton>
            <div className={`${styles.admin_table}`}>
                {updateQueue.map((map) => <span key={map.slug}>{map.title}</span>)}
                {maps && maps.map((map: IContentDoc, idx) => (
                    <div key={map.slug} className={styles.table_row}>
                        <Link href={`/maps/${map.slug}`}>View</Link>
                        <input type="text" className={styles.table_item} defaultValue={map.title}></input>
                        <input type="text" className={styles.table_item} defaultValue={map.slug}></input>
                        <input type="text" className={styles.table_item} defaultValue={map.tags}></input>
                        <textarea className={styles.table_item} defaultValue={map.shortDescription}></textarea>
                        <div>{map.creators.map((c) => (<div><input type="text" className={styles.table_item} defaultValue={c.username}></input><input type="text" className={styles.table_item} defaultValue={c.handle}></input></div>))}</div>
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
        </div>
    )
}