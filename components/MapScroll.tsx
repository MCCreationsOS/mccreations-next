'use client'
import { fetchMaps } from "@/app/getData";
import ContentScrollGrid from "./slideshows/ContentScrollGrid";
import { useEffect, useState } from "react";

export default function MapScroll() {
    const [maps, setMaps] = useState([]);

    useEffect(() => {
        const getMaps = async () => {
            setMaps((await fetchMaps({status: 3, limit: 60}, false)).documents)
        }
        getMaps();
    }, [])

    return (
        <div className="map_scroll">
            <ContentScrollGrid content={maps} />
            <ContentScrollGrid content={maps} />
        </div>
    )
}