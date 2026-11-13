'use client'

import { CollectionNames, ContentTypes, IContentDoc } from "@/app/api/types";
import Creation from "./Creation";
import {useTranslations} from 'next-intl';
import { useCreation } from "@/app/api/hooks/creations";

const isCreation = (value: unknown): value is IContentDoc => !!value && typeof value === "object" && "_id" in value

/**
 * Shown when the server couldn't load a creation without credentials (e.g. a draft). Retries in the
 * browser with the visitor's token or creation key, so owners can see their drafts.
 */
function ClientCreation({slug, contentType, collectionName, typeKey}: {slug: string, contentType: ContentTypes, collectionName: CollectionNames, typeKey: "map" | "datapack" | "resourcepack"}) {
    const {creation, isLoading} = useCreation(slug, contentType)
    const t = useTranslations()

    if (isCreation(creation)) {
        return <Creation creation={creation} collectionName={collectionName} />
    }

    if (isLoading) {
        return <div className='centered_content'>{t('Components.Creations.Page.loading')}</div>
    }

    const contentTypeName = t(typeKey, {count: 1})
    return (
        <div className='centered_content'>
            <h1>{t('Components.Creations.Page.not_found', {content_type: contentTypeName})}</h1>
            <p>{t('Components.Creations.Page.not_found_description', {content_type: contentTypeName})}</p>
        </div>
    )
}

export default function MapWrapper({slug, response}: {slug: string, response?: unknown}) {
    if (isCreation(response)) return <Creation creation={response} collectionName={CollectionNames.Maps} />
    return <ClientCreation slug={slug} contentType={ContentTypes.Maps} collectionName={CollectionNames.Maps} typeKey="map" />
}

export function DatapackWrapper({slug, response}: {slug: string, response?: unknown}) {
    if (isCreation(response)) return <Creation creation={response} collectionName={CollectionNames.Datapacks} />
    return <ClientCreation slug={slug} contentType={ContentTypes.Datapacks} collectionName={CollectionNames.Datapacks} typeKey="datapack" />
}

export function ResourcepackWrapper({slug, response}: {slug: string, response?: unknown}) {
    if (isCreation(response)) return <Creation creation={response} collectionName={CollectionNames.Resourcepacks} />
    return <ClientCreation slug={slug} contentType={ContentTypes.Resourcepacks} collectionName={CollectionNames.Resourcepacks} typeKey="resourcepack" />
}
