import '../../styles/mapPage.css'
import { fetchMap, searchContent } from '@/app/api/content';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { ICreator, IFile, IContentDoc, CollectionNames, Locales } from '@/app/api/types';
import MapWrapper from '@/components/Content/ContentWrapper';
import { Metadata, ResolvingMetadata } from 'next';
import { sendLog } from '@/app/api/logging';
import Content from '@/components/Content/Content';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Params }, parent: ResolvingMetadata): Promise<Metadata> {
    // fetch data
    const map: IContentDoc = await fetchMap(params.slug)

    if (!('_id' in map)) return {
        title: "Map Not Found",
        openGraph: {
            title: "Map Not Found",
            description: "Map Not Found",
            images: [
                {
                    url: "https://mccreations.net/images/logo.png"
                }
            ],
            siteName: "MCCreations",
            type: "article",
            url: "https://mccreations.net/maps/" + params.slug
        }
    }

    return {
        title: `${map.title} Map for Minecraft ${(map.files && map.files[0]) ? map.files[0].minecraftVersion : ""} on MCCreations`,
        description: map.shortDescription,
        authors: map.creators.map((creator: ICreator) => { return { name: creator.username } }),
        generator: "MCCreations",
        keywords: map.tags.concat(["Minecraft", "Maps", "games", "gaming", "Minecraft Maps", "Minecraft Creations", "Minecraft " + map.files[0].minecraftVersion]),
        publisher: "MCCreations",
        openGraph: {
            title: `${map.title} Map for Minecraft ${(map.files && map.files[0]) ? map.files[0].minecraftVersion : ""} on MCCreations`,
            description: map.shortDescription,
            images: map.images,
            siteName: "MCCreations",
            type: "article",
            url: "https://mccreations.net/maps/" + map.slug,
            alternateLocale: (map.translations) ? Object.keys(map.translations): [],
            authors: map.creators.map((creator: ICreator) => { return creator.username }),
            publishedTime: new Date(map.createdDate).toString(),
            modifiedTime: new Date(map.updatedDate + "").toString(),
            tags: map.tags.concat(["Minecraft", "Maps", "games", "gaming", "Minecraft Maps", "Minecraft Creations", "Minecraft " + map.files[0].minecraftVersion]),
            videos: (map.videoUrl) ? [{ url: map.videoUrl }] : []
        }
    }
}


export async function generateStaticParams() {
    const maps = (await searchContent({ contentType: CollectionNames.Maps, limit: 300 }, false)).documents
    let mapParams = maps.map((map: IContentDoc) => ({
        slug: map.slug
    }))
    let params = []
    for (let locale of Locales) {
        for (let map of mapParams) {
            params.push({
                locale: locale,
                slug: map.slug
            })
        }
    }
    // console.log(params)
    return params
}

export default async function Page({ params }: { params: Params }) {
    const map = await fetchMap(params.slug)
    const t = await getTranslations()

    if (map && '_id' in map) {
        return (
            <Content content={map} collectionName={CollectionNames.Maps} />
        )
    } else if (map) {
        return (
            <MapWrapper map={map} slug={params.slug} />
        )
    } else {
        sendLog("Map Page", "")
        return (
            <div>
                <h1>{t('content.map_not_found')}</h1>
            </div>
        )
    }

}