'use client'

import { approveContent, updateContent } from "@/app/api/content";
import { ContentTypes, IContentDoc } from "@/app/api/types"
import { FC, ReactElement, useEffect, useState } from "react";
import MainButton from "../Buttons/MainButton";
import styles from './table.module.css'
import { Plus, RefreshCw } from "react-feather";
import IconButton from "../Buttons/IconButton";
import ContentRow from "./ContentRow";

export default function AdminTable({contentType, jwt}: {contentType: ContentTypes, jwt: string}) {
    const [maps, setMaps] = useState<IContentDoc[]>([])
    const [page, setPage] = useState(0)
    const [pages, setPages] = useState(0)
    const [updateQueue, setUpdateQueue] = useState<IContentDoc[]>([])

    useEffect(() => {

        fetch(`${process.env.DATA_URL}/${contentType}-nosearch?status=0&limit=20&page=${page}`, {
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
        fetch(`${process.env.DATA_URL}/${contentType}-nosearch?status=0&limit=20&page=${page}`, {
            headers: {
                authorization: jwt + ""
            }
        }).then((res) => {
            res.json().then((data) => {
                setMaps(data.documents)
                setPages(Math.ceil(data.totalCount / 20.0))
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

    const addToUpdateQueue = (map: IContentDoc) => {
        setUpdateQueue([...updateQueue, map])
    }


    return (
        <div>
            <MainButton onClick={update}>Update {contentType}</MainButton><IconButton onClick={refresh}><RefreshCw /></IconButton>
            <div className={`${styles.admin_table}`}>
                {updateQueue.map((map) => <span key={map.slug}>{map.title}</span>)}
                {maps && maps.map((map: IContentDoc, idx) => (
                    <ContentRow key={map.slug} content={map} addToUpdateQueue={addToUpdateQueue} />
                ))}
            </div>
            { maps && pages > 1 &&  (<div className="navigator">
                {(page != 0) ? <span onClick={()=>{setPage(0)}}><img src="/chevs-left.svg"></img></span> : <></>}
                {(page != 0) ? <span onClick={()=>{(page - 1)}}><img src="/chev-left.svg"></img></span> : <></>}
                {(page - 3 >= 0) ? (page < pages - 4) ? <span onClick={()=>{(page - 3)}}>{page - 2}</span> : <span className={page == pages-7 ? "current": ""} onClick={()=>{(pages-7)}}>{pages - 6}</span> : <span className={page == 0 ? "current": ""} onClick={()=>{setPage(0)}}>{1}</span>}
                {(pages > 1) ? (page - 3 >= 0) ? (page < pages - 4) ? <span onClick={()=>{(page - 2)}}>{page - 1}</span> : <span className={page == pages-6 ? "current": ""} onClick={()=>{(pages-6)}}>{pages - 5}</span> : <span className={page == 1 ? "current": ""} onClick={()=>{setPage(1)}}>{2}</span>: <></>}
                {(pages > 2) ? (page - 3 >= 0) ? (page < pages - 4) ? <span onClick={()=>{(page - 1)}}>{page}</span> : <span className={page == pages-5 ? "current": ""} onClick={()=>{(pages-5)}}>{pages - 4}</span> : <span className={page == 2 ? "current": ""} onClick={()=>{setPage(2)}}>{3}</span>: <></>}
                {(pages > 3) ? (page - 3 >= 0) ? (page < pages - 4) ? <span className="current" onClick={()=>{(page)}}>{page + 1}</span> : <span className={page == pages-4 ? "current": ""} onClick={()=>{(pages-4)}}>{pages - 3}</span> : <span className={page == 3 ? "current": ""} onClick={()=>{setPage(3)}}>{4}</span>: <></>}
                {(pages > 4) ? (page - 3 >= 0) ? (page < pages - 4) ? <span onClick={()=>{(page +1)}}>{page +2}</span> : <span className={page == pages-3 ? "current": ""} onClick={()=>{(pages-3)}}>{pages - 2}</span> : <span className={page == 4 ? "current": ""} onClick={()=>{setPage(4)}}>{5}</span>: <></>}
                {(pages > 5) ? (page - 3 >= 0) ? (page < pages - 4) ? <span onClick={()=>{(page +2)}}>{page+3}</span> : <span className={page == pages-2 ? "current": ""} onClick={()=>{(pages-2)}}>{pages - 1}</span> : <span className={page == 5 ? "current": ""} onClick={()=>{setPage(5)}}>{6}</span>: <></>}
                {(pages > 6) ? (page - 3 >= 0) ? (page < pages - 4) ? <span onClick={()=>{(page+3)}}>{page + 4}</span> : <span className={page == pages-1 ? "current": ""} onClick={()=>{(pages-1)}}>{pages}</span> : <span className={page == 6 ? "current": ""} onClick={()=>{setPage(6)}}>{7}</span>: <></>}
                {(pages > 1) ? (page != pages -1) ? <span onClick={()=>{(page + 1)}}><img src="/chev-right.svg"></img></span> : <></>: <></>}
                {(pages > 6) ? (page != pages -1) ? <span onClick={()=>{(pages - 1)}}><img src="/chevs-right.svg"></img></span> : <></>: <></>}
            </div>) }
        </div>
    )
}