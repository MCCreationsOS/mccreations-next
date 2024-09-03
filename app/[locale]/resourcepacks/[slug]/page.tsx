import '../../styles/mapPage.css'
import { searchContent, fetchResourcepack } from '@/app/api/content';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { ICreator, IFile, IContentDoc, CollectionNames } from '@/app/api/types';
import MapWrapper, { ResourcepackWrapper } from '@/components/Content/ContentWrapper';
import { Metadata, ResolvingMetadata } from 'next';
import { sendLog } from '@/app/api/logging';
import { getI18n, getStaticParams } from '@/locales/server';
import Content from '@/components/Content/Content';
import { setStaticParamsLocale } from 'next-international/server';

export async function generateMetadata({ params }: { params: Params }, parent: ResolvingMetadata): Promise<Metadata> {
    // fetch data
    const map: IContentDoc = await fetchResourcepack(params.slug)

    if (!map || !('_id' in map)) return {
        title: "Resourcepack Not Found",
        openGraph: {
            title: "Resourcepack Not Found",
            description: "Resourcepack Not Found",
            images: [
                {
                    url: "https://mccreations.net/images/logo.png"
                }
            ],
            siteName: "MCCreations",
            type: "article",
            url: "https://mccreations.net/resourcepacks/" + params.slug
        }
    }

    if(!map.tags) map.tags = []

    return {
        title: `${map.title} Resourcepack for Minecraft ${(map.files && map.files[0]) ? map.files[0].minecraftVersion : ""} on MCCreations`,
        description: map.shortDescription,
        authors: map.creators.map((creator: ICreator) => { return { name: creator.username } }),
        generator: "MCCreations",
        keywords: map.tags.concat(["Minecraft", "Resourcepacks", "games", "gaming", "Minecraft Resourcepacks", "Minecraft Creations", "Minecraft " + map.files[0].minecraftVersion]),
        publisher: "MCCreations",
        openGraph: {
            title: `${map.title} Resourcepack for Minecraft ${(map.files && map.files[0]) ? map.files[0].minecraftVersion : ""} on MCCreations`,
            description: map.shortDescription,
            images: map.images,
            siteName: "MCCreations",
            type: "article",
            url: "https://mccreations.net/resourcepacks/" + map.slug,
            alternateLocale: (map.translations) ? Object.keys(map.translations): [],
            authors: map.creators.map((creator: ICreator) => { return creator.username }),
            publishedTime: new Date(map.createdDate).toString(),
            modifiedTime: new Date(map.updatedDate + "").toString(),
            tags: map.tags.concat(["Minecraft", "Resourcepacks", "games", "gaming", "Minecraft Resourcepacks", "Minecraft Creations", "Minecraft " + map.files[0].minecraftVersion]),
            videos: (map.videoUrl) ? [{ url: map.videoUrl }] : []
        }
    }
}


export async function generateStaticParams() {
    let locales = getStaticParams();
    const maps = (await searchContent({ contentType: CollectionNames.Resourcepacks, limit: 300 }, false)).documents
    let mapParams = maps.map((map: IContentDoc) => ({
        slug: map.slug
    }))
    let params = []
    for (let locale of locales) {
        for (let map of mapParams) {
            params.push({
                locale: locale.locale,
                slug: map.slug
            })
        }
    }
    // console.log(params)
    return params
}

export default async function Page({params}: {params: Params}) {
    setStaticParamsLocale(params.locale);
    const map = await fetchResourcepack(params.slug)
    const t = await getI18n()
    
    if(map && '_id' in map) {
        return (
            <Content content={map} collectionName={CollectionNames.Resourcepacks}/>
        )
    } else if (map) {
        return (
            <ResourcepackWrapper resourcepack={map} slug={params.slug}/>
        )
    }  else {
        sendLog("Resourcepack Page", "")
        return (
            <div>
                <h1>{t('content.resourcepack_not_found')}</h1>
            </div>
        )
    }

}