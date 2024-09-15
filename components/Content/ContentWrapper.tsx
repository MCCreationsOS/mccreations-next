'use client'

import { Suspense, useEffect, useState } from "react";
import { fetchDatapack, fetchMap, fetchResourcepack } from "@/app/api/content";
import { CollectionNames, IContentDoc } from "@/app/api/types";
import { sendLog } from "@/app/api/logging";
import Content from "./Content";
import {useTranslations} from 'next-intl';

/**
 * Wrapper for the map component that checks whether a user should be able to view the current content
 * @param slug The slug of the map
 * @param map The map object
 */
export default function MapWrapper({slug, response}: {slug: string, response?: any}) {
    if(typeof response === "object" && '_id' in response) {
        return (
            <Content content={response} collectionName={CollectionNames.Maps} />
        )
    } else {
        const [map, setMap] = useState<IContentDoc>()
        const t = useTranslations()

        useEffect(() => {
            const getData = async (token: string) => {
                let map = await fetchMap(slug, token)
                if(map && '_id' in map) {
                    setMap(map)
                } else if(map) {
                    map = await fetchMap(slug, sessionStorage.getItem('temp_key') + "")
                    setMap(map)
                }
            }
            let token = sessionStorage.getItem('jwt') + ""
            getData(token)
        }, [])

        if(map && typeof map === "object" && '_id' in map) {
            return (<Content content={map} collectionName={CollectionNames.Maps} />)
         } else {
            //  sendLog("Content Wrapper", "Map Not Found")
 
             let error = ""
             try {
                 error = JSON.parse(response).error
             } catch(e) {}
 
             if(error.length > 0) {
                 return (
                     <div className='centered_content'>
                         <h1>{t('Content.map_not_found')}</h1>
                         <p>{error}</p>
                     </div>
                 )
             }
 
             return (
                 <div className='centered_content'>
     
                     <h1>{t('Content.map_not_found')}</h1>
                     <p>{t('Content.map_not_found_description')}</p>
                 </div>
             )
         }
    }
}

export function DatapackWrapper({slug, response}: {slug: string, response?: any}) {
    if(typeof response === "object" && '_id' in response) {
        return (
            <Content content={response} collectionName={CollectionNames.Datapacks} />
        )
    } else {
        const [datapack, setDatapack] = useState<IContentDoc>()
        const t = useTranslations()

        useEffect(() => {
            const getData = async (token: string) => {
                let map = await fetchDatapack(slug, token)
                if(map && typeof map === "object" && '_id' in map) {
                    setDatapack(map)
                } else if(map) {
                    map = await fetchDatapack(slug, sessionStorage.getItem('temp_key') + "")
                    setDatapack(map)
                }
            }
            let token = sessionStorage.getItem('jwt') + ""
            getData(token)
        }, [])


        if(datapack && typeof datapack === "object" && '_id' in datapack) {
           return (<Content content={datapack} collectionName={CollectionNames.Datapacks} />)
        } else {
            // sendLog("Content Wrapper", "Datapack Not Found")

            let error = ""
            try {
                error = JSON.parse(response).error
            } catch(e) {}

            if(error.length > 0) {
                return (
                    <div className='centered_content'>
                        <h1>{t('Content.datapack_not_found')}</h1>
                        <p>{error}</p>
                    </div>
                )
            }

            return (
                <div className='centered_content'>
    
                    <h1>{t('Content.datapack_not_found')}</h1>
                    <p>{t('Content.datapack_not_found_description')}</p>
                </div>
            )
        }
    }
}

export function ResourcepackWrapper({slug, response}: {slug: string, response?: any}) {
    if(typeof response === "object" && '_id' in response) {
        return (
            <Content content={response} collectionName={CollectionNames.Resourcepacks} />
        )
    } else {
        const [resourcepack, setResourcepack] = useState<IContentDoc>()
        const t = useTranslations()

        useEffect(() => {
            const getData = async (token: string) => {
                let map = await fetchResourcepack(slug, token)
                if(map && '_id' in map) {
                    setResourcepack(map)
                } else if(map) {
                    map = await fetchResourcepack(slug, sessionStorage.getItem('temp_key') + "")
                    setResourcepack(map)
                }
            }
            let token = sessionStorage.getItem('jwt') + ""
            getData(token)
        }, [])

        if(resourcepack && typeof resourcepack === "object" && '_id' in resourcepack) {
            return (<Content content={resourcepack} collectionName={CollectionNames.Resourcepacks} />)
         } else {
             // sendLog("Content Wrapper", "Datapack Not Found")
 
             let error = ""
             try {
                 error = JSON.parse(response).error
             } catch(e) {}
 
             if(error.length > 0) {
                 return (
                     <div className='centered_content'>
                         <h1>{t('Content.resourcepack_not_found')}</h1>
                         <p>{error}</p>
                     </div>
                 )
             }
 
             return (
                 <div className='centered_content'>
     
                     <h1>{t('Content.resourcepack_not_found')}</h1>
                     <p>{t('Content.resourcepack_not_found_description')}</p>
                 </div>
             )
         }
    }
}
