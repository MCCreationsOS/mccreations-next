import { fetchDatapack } from '@/app/api/content'
import { ICreator, IContentDoc, CollectionNames } from '@/app/api/types'
import { Metadata, ResolvingMetadata } from 'next';
import { sendLog } from '@/app/api/logging';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import Creation from '@/components/Creations/Page/Creation';
import { DatapackWrapper } from '@/components/Creations/Page/ContentWrapper';

export async function generateMetadata(props: { params: Promise<{locale: string, slug: string}> }, parent: ResolvingMetadata): Promise<Metadata> {
    const params = await props.params;
    // fetch data
    const map: IContentDoc = await fetchDatapack(params.slug)
    const t = await getTranslations()
    const locale = await getLocale()
    if (!map || typeof map === "string") return {
        title: t('Pages.Datapacks.slug.Metadata.not_found_title', { content_type: t('datapack', {count: 1})}),
        openGraph: {
            title: t('Pages.Datapacks.slug.Metadata.not_found_title', { content_type: t('datapack', {count: 1})}),
            description: t('Pages.Datapacks.slug.Metadata.not_found_description', { content_type: t('datapack', {count: 1})}),
            images: [
                {
                    url: "https://mccreations.net/images/logo.png"
                }
            ],
            siteName: "MCCreations",
            type: "article",
            url: `https://mccreations.net/${locale}/datapacks/${params.slug}`
        }
    }

    if(!map.tags) map.tags = []

    return {
        title: t('Pages.Datapacks.slug.Metadata.title', {title: map.title, content_type: t('datapack', {count: 1}), creator: (map.creators && map.creators[0]) ? map.creators[0].username : "", minecraft_version: (map.files && map.files[0]) ? ( typeof map.files[0].minecraftVersion === 'string' ? map.files[0].minecraftVersion : map.files[0].minecraftVersion.join(", ")) : ""}),
        description: map.shortDescription,
        authors: (map.creators) ? map.creators.map((creator: ICreator) => { return { name: creator.username } }) : [],
        generator: "MCCreations",
        keywords: map.tags.concat([t('Pages.Datapacks.slug.Metadata.Tags.minecraft'), t('datapack', {count: 2}), t('Pages.Datapacks.slug.Metadata.Tags.games'), t('Pages.Datapacks.slug.Metadata.Tags.gaming'), t('Pages.Datapacks.slug.Metadata.Tags.minecraft_datapack'), t('Pages.Datapacks.slug.Metadata.Tags.minecraft_creations'), t('Pages.Datapacks.slug.Metadata.Tags.minecraft_version', {minecraft_version: (map.files && map.files[0]) ? ( typeof map.files[0].minecraftVersion === 'string' ? map.files[0].minecraftVersion : map.files[0].minecraftVersion.join(", ")) : ""}), t('Pages.Datapacks.slug.Metadata.Tags.mods'), t('Pages.Datapacks.slug.Metadata.Tags.minecraft_mods'), t('Pages.Datapacks.slug.Metadata.Tags.minecraft_but'), t('Pages.Datapacks.slug.Metadata.Tags.minecraft_survival')]),
        publisher: "MCCreations",
        openGraph: {
            title: t('Pages.Datapacks.slug.Metadata.title', {title: map.title, content_type: t('datapack', {count: 1}), creator: (map.creators && map.creators[0]) ? map.creators[0].username : "", minecraft_version: (map.files && map.files[0]) ? ( typeof map.files[0].minecraftVersion === 'string' ? map.files[0].minecraftVersion : map.files[0].minecraftVersion.join(", ")) : ""}),
            description: map.shortDescription,
            images: map.images,
            siteName: "MCCreations",
            type: "article",
            url: `https://mccreations.net/${locale}/datapacks/${map.slug}`,
            alternateLocale: (map.translations) ? Object.keys(map.translations): [],
            authors: (map.creators) ? map.creators.map((creator: ICreator) => { return creator.username }) : [],
            publishedTime: new Date(map.createdDate).toString(),
            modifiedTime: new Date(map.updatedDate + "").toString(),
            tags: map.tags.concat([t('Pages.Datapacks.slug.Metadata.Tags.minecraft'), t('datapack', {count: 2}), t('Pages.Datapacks.slug.Metadata.Tags.games'), t('Pages.Datapacks.slug.Metadata.Tags.gaming'), t('Pages.Datapacks.slug.Metadata.Tags.minecraft_datapack'), t('Pages.Datapacks.slug.Metadata.Tags.minecraft_creations'), t('Pages.Datapacks.slug.Metadata.Tags.minecraft_version', {minecraft_version: (map.files && map.files[0]) ? ( typeof map.files[0].minecraftVersion === 'string' ? map.files[0].minecraftVersion : map.files[0].minecraftVersion.join(", ")) : ""}), t('Pages.Datapacks.slug.Metadata.Tags.mods'), t('Pages.Datapacks.slug.Metadata.Tags.minecraft_mods'), t('Pages.Datapacks.slug.Metadata.Tags.minecraft_but'), t('Pages.Datapacks.slug.Metadata.Tags.minecraft_survival')]),
            videos: (map.videoUrl) ? [{ url: map.videoUrl }] : []
        }
    }
}

export default async function Page(props: {params: Promise<{locale: string, slug: string}>}) {
    const params = await props.params;
    const map = await fetchDatapack(params.slug)
    setRequestLocale(params.locale)
    const t = await getTranslations()

    if(map && typeof map === "object" && "_id" in map) {
        return (
            <Creation creation={map} collectionName={CollectionNames.Datapacks}/>
        )
    } else if (map) {
        return (
            <DatapackWrapper response={map} slug={params.slug}/>
        )
    }  else {
        sendLog("Datapack Page", "")
        return (
            <div className='centered_content'>

                <h1>{t('Pages.Datapacks.slug.Metadata.not_found_title')}</h1>
                <p>{t('Pages.Datapacks.slug.Metadata.not_found_description')}</p>
            </div>
        )
    }
}