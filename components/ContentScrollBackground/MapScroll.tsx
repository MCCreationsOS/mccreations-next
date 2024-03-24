'use client'
import { fetchMaps } from "@/app/api/content";
import ContentScrollGrid from "./ContentScrollGrid";
import { useEffect, useState } from "react";
import styles from './ContentScrollBackground.module.css'

export default function MapScroll() {
    const [maps, setMaps] = useState([]);

    useEffect(() => {
        const getMaps = async () => {
            setMaps((await fetchMaps({status: 3, limit: 60}, false)).documents)
        }
        getMaps();
    }, [])

    return (
        <div className={styles.map_scroll}>
            <ContentScrollGrid content={maps} />
            <ContentScrollGrid content={maps} />
        </div>
    )
}