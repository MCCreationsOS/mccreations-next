import { fetchMap, searchContent } from '@/app/api/content';
import { ICreator, IFile, IContentDoc, CollectionNames } from '@/app/api/types';
import MapWrapper from '@/components/Creations/Page/ContentWrapper';
import { GetStaticPaths, GetStaticProps, Metadata, ResolvingMetadata } from 'next';
import { sendLog } from '@/app/api/logging';
import Creation from '@/components/Creations/Page/Creation';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic'

export async function generateMetadata(props: { params: Promise<{locale: string, slug: string}> }, parent: ResolvingMetadata): Promise<Metadata> {
    const params = await props.params;
    // fetch data
    const map: IContentDoc = await fetchMap(params.slug)

    const t = await getTranslations({locale: params.locale})
    if (!map || typeof map === "string") return {
        title: t('Pages.Maps.slug.Metadata.not_found_title', { content_type: t('map', {count: 1})}),
        openGraph: {
            title: t('Pages.Maps.slug.Metadata.not_found_title', { content_type: t('map', {count: 1})}),
            description: t('Pages.Maps.slug.Metadata.not_found_description', { content_type: t('map', {count: 1})}),
            images: [
                {
                    url: "https://mccreations.net/images/logo.png"
                }
            ],
            siteName: "MCCreations",
            type: "article",
            url: `https://mccreations.net/${params.locale}/maps/${params.slug}`
        }
    }

    if(!map.tags) map.tags = []

    return {
        title: t('Pages.Maps.slug.Metadata.title', {title: map.title, content_type: t('map', {count: 1}), creator: map.creators && map.creators.length > 0 ? map.creators[0].username : "", minecraft_version: (map.files && map.files.length > 0) ? ( typeof map.files[0].minecraftVersion === 'object' ? map.files[0].minecraftVersion.filter((version: string) => version !== "").join(", ") : map.files[0].minecraftVersion ?? "") : ""}),
        description: map.shortDescription,
        authors: (map.creators) ? map.creators.map((creator: ICreator) => { return { name: creator.username } }) : [],
        generator: "MCCreations",
        keywords: map.tags.concat([t('Pages.Maps.slug.Metadata.Tags.minecraft'), t('map', {count: 2}), t('Pages.Maps.slug.Metadata.Tags.games'), t('Pages.Maps.slug.Metadata.Tags.gaming'), t('Pages.Maps.slug.Metadata.Tags.minecraft_map'), t('Pages.Maps.slug.Metadata.Tags.minecraft_creations'), t('Pages.Maps.slug.Metadata.Tags.minecraft_version', {minecraft_version: (map.files && map.files.length > 0) ? ( typeof map.files[0].minecraftVersion === 'object' ? map.files[0].minecraftVersion.filter((version: string) => version !== "").join(", ") : map.files[0].minecraftVersion ?? "") : ""}), t('Pages.Maps.slug.Metadata.Tags.maps'), t('Pages.Maps.slug.Metadata.Tags.minecraft_games'), t('Pages.Maps.slug.Metadata.Tags.download'), t('Pages.Maps.slug.Metadata.Tags.minecraft_adventure'), t('Pages.Maps.slug.Metadata.Tags.minecraft_parkour'), t('Pages.Maps.slug.Metadata.Tags.minecraft_pvp'), t('Pages.Maps.slug.Metadata.Tags.minecraft_skyblock'), t('Pages.Maps.slug.Metadata.Tags.minecraft_survival'), t('Pages.Maps.slug.Metadata.Tags.minecraft_creative'), t('Pages.Maps.slug.Metadata.Tags.minecraft_minigames')]),
        publisher: "MCCreations",
        openGraph: {
            title: t('Pages.Maps.slug.Metadata.title', {title: map.title, content_type: t('map', {count: 1}), creator: map.creators && map.creators.length > 0 ? map.creators[0].username : "", minecraft_version: (map.files && map.files.length > 0) ? ( typeof map.files[0].minecraftVersion === 'object' ? map.files[0].minecraftVersion.filter((version: string) => version !== "").join(", ") : map.files[0].minecraftVersion ?? "") : ""}),
            description: map.shortDescription,
            images: map.images,
            siteName: "MCCreations",
            type: "article",
            url: `https://mccreations.net/${params.locale}/maps/${map.slug}`,
            alternateLocale: (map.translations) ? Object.keys(map.translations): [],
            authors: (map.creators) ? map.creators.map((creator: ICreator) => { return creator.username }) : [],
            publishedTime: new Date(map.createdDate).toString(),
            modifiedTime: new Date(map.updatedDate + "").toString(),
            tags: map.tags.concat([t('Pages.Maps.slug.Metadata.Tags.minecraft'), t('map', {count: 2}), t('Pages.Maps.slug.Metadata.Tags.games'), t('Pages.Maps.slug.Metadata.Tags.gaming'), t('Pages.Maps.slug.Metadata.Tags.minecraft_map'), t('Pages.Maps.slug.Metadata.Tags.minecraft_creations'), t('Pages.Maps.slug.Metadata.Tags.minecraft_version', {minecraft_version: (map.files && map.files.length > 0) ? ( typeof map.files[0].minecraftVersion === 'object' ? map.files[0].minecraftVersion.filter((version: string) => version !== "").join(", ") : map.files[0].minecraftVersion ?? "") : ""}), t('Pages.Maps.slug.Metadata.Tags.maps'), t('Pages.Maps.slug.Metadata.Tags.minecraft_games'), t('Pages.Maps.slug.Metadata.Tags.download'), t('Pages.Maps.slug.Metadata.Tags.minecraft_adventure'), t('Pages.Maps.slug.Metadata.Tags.minecraft_parkour'), t('Pages.Maps.slug.Metadata.Tags.minecraft_pvp'), t('Pages.Maps.slug.Metadata.Tags.minecraft_skyblock'), t('Pages.Maps.slug.Metadata.Tags.minecraft_survival'), t('Pages.Maps.slug.Metadata.Tags.minecraft_creative'), t('Pages.Maps.slug.Metadata.Tags.minecraft_minigames')]),
            videos: (map.videoUrl) ? [{ url: map.videoUrl }] : []
        }
    }
}

export default async function Page(props: { params: Promise<{locale: string, slug: string}> }) {
    const params = await props.params;
    const map = await fetchMap(params.slug)
    setRequestLocale(params.locale)
    const t = await getTranslations({locale: params.locale})

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

                <h1>{t('Pages.Maps.slug.Metadata.not_found_title')}</h1>
                <p>{t('Pages.Maps.slug.Metadata.not_found_description')}</p>
            </div>
        )
    }
}