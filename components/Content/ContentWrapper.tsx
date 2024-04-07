'use client'

import MapComponent from "./Map";
import { Suspense, useEffect, useState } from "react";
import { fetchMap } from "@/app/api/content";
import { IMap } from "@/app/types";
import { sendLog } from "@/app/api/logging";

export default function MapWrapper({slug, map}: {slug: string, map?: any}) {
    if('_id' in map) {
        return (
            <MapComponent map={map} privileged={false} />
        )
    } else {
        const [map, setMap] = useState<IMap>()

        useEffect(() => {
            const getData = async (token: string) => {
                setMap(await fetchMap(slug, token))
            }
            let token = sessionStorage.getItem('jwt')
            if(token) {
                getData(token)
            } else {
                token = sessionStorage.getItem('temp_key')
                if(token) getData(token)
            }
        }, [])


        if(map && '_id' in map) {
           return (<MapComponent map={map} privileged={true} />)
        } else {
            sendLog("Content Wrapper", "Map Not Found")
            return (
                <div>
                    <h1>Map Not Found</h1>
                </div>
            )
        }
    }
}


