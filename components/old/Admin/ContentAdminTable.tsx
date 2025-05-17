'use client'

import { approveContent, updateContent } from "@/app/api/content";
import { CollectionNames, IContentDoc } from "@/app/api/types"
import { FC, ReactElement, useEffect, useState } from "react";
import MainButton from "../Buttons/MainButton";
import styles from './table.module.css'
import { Plus, RefreshCw } from "lucide-react";
import IconButton from "../Buttons/IconButton";
import ContentRow from "./ContentRow";
import { useCreations } from "@/app/api/hooks/creations";

export default function ContentAdminTable({contentType, jwt}: {contentType: CollectionNames, jwt: string}) {
    const [page, setPage] = useState(0)
    const {creations, count, isLoading, error} = useCreations({contentType: contentType, limit: 20, page: page, status: 0})
    const pages = Math.ceil(count / 20.0)
    const [updateQueue, setUpdateQueue] = useState<IContentDoc[]>([])

    const update = async () => {
        updateQueue.forEach((map) => {
            updateContent(map, localStorage?.getItem('jwt'), contentType, true)       
        })
        setUpdateQueue([])
    }

    const addToUpdateQueue = (map: IContentDoc) => {
        setUpdateQueue([...updateQueue, map])
    }

    if(isLoading || !creations || count == 0 || error) {
        return null
    }


    return (
        <div>
            <MainButton onClick={update}>Update {contentType}</MainButton><IconButton><RefreshCw /></IconButton>
            <div className={`${styles.admin_table}`}>
                {updateQueue.map((map) => <span key={map.slug}>{map.title}</span>)}
                {creations && creations.map((map: IContentDoc, idx) => (
                    <ContentRow key={map.slug} content={map} addToUpdateQueue={addToUpdateQueue} />
                ))}
            </div>
            {creations && pages > 1 &&  (<div className="navigator">
                {(page != 0) ? <span onClick={()=>{setPage(0)}}><img src="/chevs-left.svg"></img></span> : <></>}
                {(page != 0) ? <span onClick={()=>{setPage(page - 1)}}><img src="/chev-left.svg"></img></span> : <></>}
                {(page - 3 >= 0) ? (page < pages - 4) ? <span onClick={()=>{setPage(page - 3)}}>{page - 2}</span> : <span className={page == pages-7 ? "current": ""} onClick={()=>{(setPage(pages-7))}}>{pages - 6}</span> : <span className={page == 0 ? "current": ""} onClick={()=>{setPage(0)}}>{1}</span>}
                {(pages > 1) ? (page - 3 >= 0) ? (page < pages - 4) ? <span onClick={()=>{setPage(page - 2)}}>{page - 1}</span> : <span className={page == pages-6 ? "current": ""} onClick={()=>{(setPage(pages-6))}}>{pages - 5}</span> : <span className={page == 1 ? "current": ""} onClick={()=>{setPage(1)}}>{2}</span>: <></>}
                {(pages > 2) ? (page - 3 >= 0) ? (page < pages - 4) ? <span onClick={()=>{setPage(page - 1)}}>{page}</span> : <span className={page == pages-5 ? "current": ""} onClick={()=>{(setPage(pages-5))}}>{pages - 4}</span> : <span className={page == 2 ? "current": ""} onClick={()=>{setPage(2)}}>{3}</span>: <></>}
                {(pages > 3) ? (page - 3 >= 0) ? (page < pages - 4) ? <span className="current" onClick={()=>{(page)}}>{page + 1}</span> : <span className={page == pages-4 ? "current": ""} onClick={()=>{(setPage(pages-4))}}>{pages - 3}</span> : <span className={page == 3 ? "current": ""} onClick={()=>{setPage(3)}}>{4}</span>: <></>}
                {(pages > 4) ? (page - 3 >= 0) ? (page < pages - 4) ? <span onClick={()=>{setPage(page +1)}}>{page +2}</span> : <span className={page == pages-3 ? "current": ""} onClick={()=>{(setPage(pages-3))}}>{pages - 2}</span> : <span className={page == 4 ? "current": ""} onClick={()=>{setPage(4)}}>{5}</span>: <></>}
                {(pages > 5) ? (page - 3 >= 0) ? (page < pages - 4) ? <span onClick={()=>{setPage(page +2)}}>{page+3}</span> : <span className={page == pages-2 ? "current": ""} onClick={()=>{(setPage(pages-2))}}>{pages - 1}</span> : <span className={page == 5 ? "current": ""} onClick={()=>{setPage(5)}}>{6}</span>: <></>}
                {(pages > 6) ? (page - 3 >= 0) ? (page < pages - 4) ? <span onClick={()=>{setPage(page+3)}}>{page + 4}</span> : <span className={page == pages-1 ? "current": ""} onClick={()=>{(setPage(pages-1))}}>{pages}</span> : <span className={page == 6 ? "current": ""} onClick={()=>{setPage(6)}}>{7}</span>: <></>}
                {(pages > 1) ? (page != pages -1) ? <span onClick={()=>{setPage(page + 1)}}><img src="/chev-right.svg"></img></span> : <></>: <></>}
                {(pages > 6) ? (page != pages -1) ? <span onClick={()=>{setPage(pages - 1)}}><img src="/chevs-right.svg"></img></span> : <></>: <></>}
            </div>) }
        </div>
    )
}