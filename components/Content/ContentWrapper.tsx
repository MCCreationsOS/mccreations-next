'use client'

import { Suspense, useEffect, useState } from "react";
import { fetchDatapack, fetchMap, fetchResourcepack } from "@/app/api/content";
import { ContentTypes, IContentDoc } from "@/app/api/types";
import { sendLog } from "@/app/api/logging";
import Content from "./Content";
import { useI18n } from "@/locales/client";

/**
 * Wrapper for the map component that checks whether a user should be able to view the current content
 * @param slug The slug of the map
 * @param map The map object
 */
export default function MapWrapper({slug, map}: {slug: string, map?: any}) {
    if('_id' in map) {
        return (
            <Content content={map} contentType={ContentTypes.Maps} />
        )
    } else {
        const [map, setMap] = useState<IContentDoc>()
        const t = useI18n()

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
           return (<Content content={map} contentType={ContentTypes.Maps} />)
        } else {
            sendLog("Content Wrapper", "Map Not Found")
            return (
                <div>
                    <h1>{t('content.map_not_found')}</h1>
                </div>
            )
        }
    }
}

export function DatapackWrapper({slug, datapack}: {slug: string, datapack?: any}) {
    if('_id' in datapack) {
        return (
            <Content content={datapack} contentType={ContentTypes.Datapacks} />
        )
    } else {
        const [datapack, setDatapack] = useState<IContentDoc>()
        const t = useI18n()

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
           return (<Content content={datapack} contentType={ContentTypes.Datapacks} />)
        } else {
            sendLog("Content Wrapper", "Datapack Not Found")
            return (
                <div>
                    <h1>{t('content.datapack_not_found')}</h1>
                </div>
            )
        }
    }
}

export function ResourcepackWrapper({slug, resourcepack}: {slug: string, resourcepack?: any}) {
    if('_id' in resourcepack) {
        return (
            <Content content={resourcepack} contentType={ContentTypes.Resourcepacks} />
        )
    } else {
        const [resourcepack, setResourcepack] = useState<IContentDoc>()
        const t = useI18n()

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
           return (<Content content={resourcepack} contentType={ContentTypes.Resourcepacks} />)
        } else {
            sendLog("Content Wrapper", "Resourcepack Not Found")
            return (
                <div>
                    <h1>{t('content.resourcepack_not_found')}</h1>
                </div>
            )
        }
    }
}
