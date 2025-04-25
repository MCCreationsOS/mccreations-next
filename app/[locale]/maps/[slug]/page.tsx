import { fetchMap, searchContent } from '@/app/api/content';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { ICreator, IFile, IContentDoc, CollectionNames, Locales } from '@/app/api/types';
import MapWrapper from '@/components/Creations/Page/ContentWrapper';
import { GetStaticPaths, GetStaticProps, Metadata, ResolvingMetadata } from 'next';
import { sendLog } from '@/app/api/logging';
import Creation from '@/components/Creations/Page/Creation';
import { getLocale, getTranslations, unstable_setRequestLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Params }, parent: ResolvingMetadata): Promise<Metadata> {
    // fetch data
    const map: IContentDoc = await fetchMap(params.slug)

    const t = await getTranslations()
    const locale = await getLocale()
    if (!map || typeof map === "string") return {
        title: t('Creation.Metadata.not_found_title', { content_type: t('map', {count: 1})}),
        openGraph: {
            title: t('Creation.Metadata.not_found_title', { content_type: t('map', {count: 1})}),
            description: t('Creation.Metadata.not_found_description', { content_type: t('map', {count: 1})}),
            images: [
                {
                    url: "https://mccreations.net/images/logo.png"
                }
            ],
            siteName: "MCCreations",
            type: "article",
            url: `https://mccreations.net/${locale}/maps/${params.slug}`
        }
    }

    if(!map.tags) map.tags = []

    return {
        title: t('Creation.Metadata.title', {title: map.title, content_type: t('map', {count: 1}), creator: map.creators && map.creators.length > 0 ? map.creators[0].username : "", minecraft_version: (map.files && map.files[0]) ? map.files[0].minecraftVersion : ""}),
        description: map.shortDescription,
        authors: (map.creators) ? map.creators.map((creator: ICreator) => { return { name: creator.username } }) : [],
        generator: "MCCreations",
        keywords: map.tags.concat([t('Creation.Metadata.Tags.minecraft'), t('map', {count: 2}), t('Creation.Metadata.Tags.games'), t('Creation.Metadata.Tags.gaming'), t('Creation.Metadata.Tags.minecraft_map'), t('Creation.Metadata.Tags.minecraft_creations'), t('Creation.Metadata.Tags.minecraft_version', {minecraft_version: (map.files && map.files[0]) ? map.files[0].minecraftVersion : ""})]),
        publisher: "MCCreations",
        openGraph: {
            title: t('Creation.Metadata.title', {title: map.title, content_type: t('map', {count: 1}), creator: map.creators && map.creators.length > 0 ? map.creators[0].username : "", minecraft_version: (map.files && map.files[0]) ? map.files[0].minecraftVersion : ""}),
            description: map.shortDescription,
            images: map.images,
            siteName: "MCCreations",
            type: "article",
            url: `https://mccreations.net/${locale}/maps/${map.slug}`,
            alternateLocale: (map.translations) ? Object.keys(map.translations): [],
            authors: (map.creators) ? map.creators.map((creator: ICreator) => { return creator.username }) : [],
            publishedTime: new Date(map.createdDate).toString(),
            modifiedTime: new Date(map.updatedDate + "").toString(),
            tags: map.tags.concat([t('Creation.Metadata.Tags.minecraft'), t('map', {count: 2}), t('Creation.Metadata.Tags.games'), t('Creation.Metadata.Tags.gaming'), t('Creation.Metadata.Tags.minecraft_map'), t('Creation.Metadata.Tags.minecraft_creations'), t('Creation.Metadata.Tags.minecraft_version', {minecraft_version: (map.files && map.files[0]) ? map.files[0].minecraftVersion : ""})]),
            videos: (map.videoUrl) ? [{ url: map.videoUrl }] : []
        }
    }
}

export default async function Page({ params }: { params: Params }) {
    const map = await fetchMap(params.slug)
    unstable_setRequestLocale(params.locale)
    const t = await getTranslations()

    if (map && '_id' in map) {
        return (
            <Creation creation={map} collectionName={CollectionNames.Maps} />
        )
    } else if (map) {
        return (
            <MapWrapper response={map} slug={params.slug} />
        )
    } else {
        sendLog("Map Page", "")
        return (
            <div className='centered_content'>

                <h1>{t('Creation.map_not_found')}</h1>
                <p>{t('Creation.map_not_found_description')}</p>
            </div>
        )
    }

}