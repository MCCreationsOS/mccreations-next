'use client'

import { Suspense, useEffect, useState } from "react";
import { fetchDatapack, fetchMap, fetchResourcepack } from "@/app/api/content";
import { CollectionNames, ContentTypes, IContentDoc } from "@/app/api/types";
import { sendLog } from "@/app/api/logging";
import Creation from "./Creation";
import {useTranslations} from 'next-intl';
import { useCreation } from "@/app/api/hooks/creations";

/**
 * Wrapper for the map component that checks whether a user should be able to view the current content
 * @param slug The slug of the map
 * @param map The map object
 */
export default function MapWrapper({slug, response}: {slug: string, response?: any}) {
    if(typeof response === "object" && '_id' in response) {
        return (
            <Creation creation={response} collectionName={CollectionNames.Maps} />
        )
    } else {
        const {creation, isLoading, error} = useCreation(slug, ContentTypes.Maps)
        const t = useTranslations()

        if(creation && typeof creation === "object" && '_id' in creation) {
            return (<Creation creation={creation} collectionName={CollectionNames.Maps} />)
         } else {
            //  sendLog("Content Wrapper", "Map Not Found")
 
             let error = ""
             try {
                 error = JSON.parse(response).error
             } catch(e) {}
 
             if(error.length > 0) {
                 return (
                     <div className='centered_content'>
                         <h1>{t('Components.Creations.Page.not_found', {content_type: t('map', {count: 1})})}</h1>
                         <p>{error}</p>
                     </div>
                 )
             }
 
             return (
                 <div className='centered_content'>
     
                     <h1>{t('Components.Creations.Page.not_found', {content_type: t('map', {count: 1})})}</h1>
                     <p>{t('Components.Creations.Page.not_found_description', {content_type: t('map', {count: 1})})}</p>
                 </div>
             )
         }
    }
}

export function DatapackWrapper({slug, response}: {slug: string, response?: any}) {
    if(typeof response === "object" && '_id' in response) {
        return (
            <Creation creation={response} collectionName={CollectionNames.Datapacks} />
        )
    } else {
        const {creation, isLoading, error} = useCreation(slug, ContentTypes.Datapacks)
        const t = useTranslations()

        if(creation && typeof creation === "object" && '_id' in creation) {
           return (<Creation creation={creation} collectionName={CollectionNames.Datapacks} />)
        } else {
            // sendLog("Content Wrapper", "Datapack Not Found")

            let error = ""
            try {
                error = JSON.parse(response).error
            } catch(e) {}

            if(error.length > 0) {
                return (
                    <div className='centered_content'>
                        <h1>{t('Components.Creations.Page.not_found', {content_type: t('datapack', {count: 1})})}</h1>
                        <p>{error}</p>
                    </div>
                )
            }

            return (
                <div className='centered_content'>
    
                    <h1>{t('Components.Creations.Page.not_found', {content_type: t('datapack', {count: 1})})}</h1>
                    <p>{t('Components.Creations.Page.not_found_description', {content_type: t('datapack', {count: 1})})}</p>
                </div>
            )
        }
    }
}

export function ResourcepackWrapper({slug, response}: {slug: string, response?: any}) {
    if(typeof response === "object" && '_id' in response) {
        return (
            <Creation creation={response} collectionName={CollectionNames.Resourcepacks} />
        )
    } else {
        const {creation, isLoading, error} = useCreation(slug, ContentTypes.Resourcepacks)
        const t = useTranslations()

        if(creation && typeof creation === "object" && '_id' in creation) {
            return (<Creation creation={creation} collectionName={CollectionNames.Resourcepacks} />)
         } else {
             // sendLog("Content Wrapper", "Datapack Not Found")
 
             let error = ""
             try {
                 error = JSON.parse(response).error
             } catch(e) {}
 
             if(error.length > 0) {
                 return (
                     <div className='centered_content'>
                         <h1>{t('Components.Creations.Page.not_found', {content_type: t('resourcepack', {count: 1})})}</h1>
                         <p>{error}</p>
                     </div>
                 )
             }
 
             return (
                 <div className='centered_content'>
     
                     <h1>{t('Components.Creations.Page.not_found', {content_type: t('resourcepack', {count: 1})})}</h1>
                     <p>{t('Components.Creations.Page.not_found_description', {content_type: t('resourcepack', {count: 1})})}</p>
                 </div>
             )
         }
    }
}
