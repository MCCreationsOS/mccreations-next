import '../../styles/mapPage.css'
import { fetchMap, searchContent } from '@/app/api/content';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { ICreator, IFile, IContentDoc, CollectionNames } from '@/app/api/types';
import MapWrapper from '@/components/Content/ContentWrapper';
import { Metadata, ResolvingMetadata } from 'next';
import { sendLog } from '@/app/api/logging';
import { getI18n, getStaticParams } from '@/locales/server';
import Content from '@/components/Content/Content';
import { setStaticParamsLocale } from 'next-international/server';

export async function generateMetadata(
{ params }: {params: Params},
parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const id = params.id
   
    // fetch data
    const map: IContentDoc = await fetchMap(params.slug)

    if(!map || !map.images) return {
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
      title: `${map.title} Map for Minecraft ${map.files[0].minecraftVersion} on MCCreations`,
      openGraph: {
        title: `${map.title} Map for Minecraft ${map.files[0].minecraftVersion} on MCCreations`,
        description: map.shortDescription,
        images: [
          ...map.images
        ],
        siteName: "MCCreations",
        type: "article",
        url: "https://mccreations.net/maps/" + map.slug
      }
    }
  }


export async function generateStaticParams() {
    let locale = getStaticParams();
    const maps = (await searchContent({contentType: CollectionNames.Maps}, false)).documents
    let mapParams =  maps.map((map: IContentDoc) => ({
        slug: map.slug
    }))
    locale = locale.concat(mapParams)
    return locale
}

export default async function Page({params}: {params: Params}) {
    setStaticParamsLocale(params.locale);
    const map = await fetchMap(params.slug)
    const t = await getI18n()
    
    if(map && '_id' in map) {
        return (
            <Content content={map} collectionName={CollectionNames.Maps}/>
        )
    } else if (map) {
        return (
            <MapWrapper map={map} slug={params.slug}/>
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