'use client'

import MapComponent from "./Map";
import { Suspense, useEffect, useState } from "react";
import { fetchDatapack, fetchMap, fetchResourcepack } from "@/app/api/content";
import { IContentDoc } from "@/app/types";
import { sendLog } from "@/app/api/logging";
import DatapackComponent from "./Datapack";
import ResourcepackComponent from "./Resourcepack";

/**
 * Wrapper for the map component that checks whether a user should be able to view the current content
 * @param slug The slug of the map
 * @param map The map object
 */
export default function MapWrapper({slug, map}: {slug: string, map?: any}) {
    if('_id' in map) {
        return (
            <MapComponent map={map} />
        )
    } else {
        const [map, setMap] = useState<IContentDoc>()

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
           return (<MapComponent map={map} />)
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

export function DatapackWrapper({slug, datapack}: {slug: string, datapack?: any}) {
    if('_id' in datapack) {
        return (
            <DatapackComponent datapack={datapack} />
        )
    } else {
        const [datapack, setDatapack] = useState<IContentDoc>()

        useEffect(() => {
            const getData = async (token: string) => {
                setDatapack(await fetchDatapack(slug, token))
            }
            let token = sessionStorage.getItem('jwt')
            if(token) {
                getData(token)
            } else {
                token = sessionStorage.getItem('temp_key')
                if(token) getData(token)
            }
        }, [])


        if(datapack && '_id' in datapack) {
           return (<DatapackComponent datapack={datapack} />)
        } else {
            sendLog("Content Wrapper", "Datapack Not Found")
            return (
                <div>
                    <h1>Datapack Not Found</h1>
                </div>
            )
        }
    }
}

export function ResourcepackWrapper({slug, resourcepack}: {slug: string, resourcepack?: any}) {
    if('_id' in resourcepack) {
        return (
            <ResourcepackComponent resourcepack={resourcepack} />
        )
    } else {
        const [resourcepack, setResourcepack] = useState<IContentDoc>()

        useEffect(() => {
            const getData = async (token: string) => {
                setResourcepack(await fetchResourcepack(slug, token))
            }
            let token = sessionStorage.getItem('jwt')
            if(token) {
                getData(token)
            } else {
                token = sessionStorage.getItem('temp_key')
                if(token) getData(token)
            }
        }, [])


        if(resourcepack && '_id' in resourcepack) {
           return (<ResourcepackComponent resourcepack={resourcepack} />)
        } else {
            sendLog("Content Wrapper", "Datapack Not Found")
            return (
                <div>
                    <h1>Resourcepacks Not Found</h1>
                </div>
            )
        }
    }
}
