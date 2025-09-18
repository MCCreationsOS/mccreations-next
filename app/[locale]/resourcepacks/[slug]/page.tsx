import { fetchResourcepack } from '@/app/api/content';
import { ICreator, IContentDoc, CollectionNames } from '@/app/api/types';
import MapWrapper, { ResourcepackWrapper } from '@/components/Creations/Page/ContentWrapper';
import { Metadata, ResolvingMetadata } from 'next';
import { sendLog } from '@/app/api/logging';
import Creation from '@/components/Creations/Page/Creation';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata(props: { params: Promise<{locale: string, slug: string}> }, parent: ResolvingMetadata): Promise<Metadata> {
    const params = await props.params;
    // fetch data
    const map: IContentDoc = await fetchResourcepack(params.slug)

    const t = await getTranslations({locale: params.locale})
    const locale = await getLocale()
    if (!map || typeof map === "string") return {
        title: t('Pages.Resourcepacks.slug.Metadata.not_found_title', { content_type: t('resourcepack', {count: 1})}),
        openGraph: {
            title: t('Pages.Resourcepacks.slug.Metadata.not_found_title', { content_type: t('resourcepack', {count: 1})}),
            description: t('Pages.Resourcepacks.slug.Metadata.not_found_description', { content_type: t('resourcepack', {count: 1})}),
            images: [
                {
                    url: "https://mccreations.net/images/logo.png"
                }
            ],
            siteName: "MCCreations",
            type: "article",
            url: `https://mccreations.net/${locale}/resourcepacks/${params.slug}`
        }
    }

    if(!map.tags) map.tags = []

    let minecraftVersion = ""
    if(map.files && map.files.length > 0) {
        if(typeof map.files[0].minecraftVersion === "string") {
            minecraftVersion = map.files[0].minecraftVersion
        } else if(map.files[0].minecraftVersion && map.files[0].minecraftVersion.length > 0) {
            minecraftVersion = map.files[0].minecraftVersion.filter((version: string) => version !== "").join(", ")
        } else {
            minecraftVersion = ""
        }
    }

    return {
        title: t('Pages.Resourcepacks.slug.Metadata.title', {title: map.title, content_type: t('resourcepack', {count: 1}), creator: (map.creators && map.creators[0]) ? map.creators[0].username : "", minecraft_version: minecraftVersion}),
        description: map.shortDescription,
        authors: (map.creators) ? map.creators.map((creator: ICreator) => { return { name: creator.username } }) : [],
        generator: "MCCreations",
        keywords: map.tags.concat([t('Pages.Resourcepacks.slug.Metadata.Tags.minecraft'), t('resourcepack', {count: 2}), t('Pages.Resourcepacks.slug.Metadata.Tags.games'), t('Pages.Resourcepacks.slug.Metadata.Tags.gaming'), t('Pages.Resourcepacks.slug.Metadata.Tags.minecraft_resourcepack'), t('Pages.Resourcepacks.slug.Metadata.Tags.minecraft_creations'), t('Pages.Resourcepacks.slug.Metadata.Tags.minecraft_version', {minecraft_version: minecraftVersion}), t('Pages.Resourcepacks.slug.Metadata.Tags.mods'), t('Pages.Resourcepacks.slug.Metadata.Tags.minecraft_mods'), t('Pages.Resourcepacks.slug.Metadata.Tags.minecraft_hd')]),
        publisher: "MCCreations",
        openGraph: {
            title: t('Pages.Resourcepacks.slug.Metadata.title', {title: map.title, content_type: t('resourcepack', {count: 1}), creator: (map.creators && map.creators[0]) ? map.creators[0].username : "", minecraft_version: minecraftVersion}),
            description: map.shortDescription,
            images: map.images,
            siteName: "MCCreations",
            type: "article",
            url: `https://mccreations.net/${locale}/resourcepacks/${map.slug}`,
            alternateLocale: (map.translations) ? Object.keys(map.translations): [],
            authors: (map.creators) ? map.creators.map((creator: ICreator) => { return creator.username }) : [],
            publishedTime: new Date(map.createdDate).toString(),
            modifiedTime: new Date(map.updatedDate + "").toString(),
            tags: map.tags.concat([t('Pages.Resourcepacks.slug.Metadata.Tags.minecraft'), t('resourcepack', {count: 2}), t('Pages.Resourcepacks.slug.Metadata.Tags.games'), t('Pages.Resourcepacks.slug.Metadata.Tags.gaming'), t('Pages.Resourcepacks.slug.Metadata.Tags.minecraft_resourcepack'), t('Pages.Resourcepacks.slug.Metadata.Tags.minecraft_creations'), t('Pages.Resourcepacks.slug.Metadata.Tags.minecraft_version', {minecraft_version: minecraftVersion}), t('Pages.Resourcepacks.slug.Metadata.Tags.mods'), t('Pages.Resourcepacks.slug.Metadata.Tags.minecraft_mods'), t('Pages.Resourcepacks.slug.Metadata.Tags.minecraft_hd')]),
            videos: (map.videoUrl) ? [{ url: map.videoUrl }] : []
        }
    }
}

export default async function Page(props: {params: Promise<{locale: string, slug: string}>}) {
    const params = await props.params;
    const map = await fetchResourcepack(params.slug)
    setRequestLocale(params.locale)
    const t = await getTranslations({locale: params.locale})

    if(map && '_id' in map) {
        return (
            <Creation creation={map} collectionName={CollectionNames.Resourcepacks}/>
        )
    } else if (map) {
        return (
            <ResourcepackWrapper response={map} slug={params.slug}/>
        )
    }  else {
        sendLog("Resourcepack Page", "")
        return (
            <div className='centered_content'>

                <h1>{t('Pages.Resourcepacks.slug.Metadata.not_found_title', { content_type: t('resourcepack', {count: 1})})}</h1>
                <p>{t('Pages.Resourcepacks.slug.Metadata.not_found_description', { content_type: t('resourcepack', {count: 1})})}</p>
            </div>
        )
    }
}