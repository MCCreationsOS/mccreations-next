import '../../styles/mapPage.css'
import { searchContent, fetchDatapack, fetchResourcepack } from '@/app/api/content';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { ICreator, IFile, IContentDoc, CollectionNames } from '@/app/api/types';
import MapWrapper, { DatapackWrapper, ResourcepackWrapper } from '@/components/Content/ContentWrapper';
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
    const resourcepack: IContentDoc = await fetchResourcepack(params.slug)

    if(!resourcepack || !resourcepack.images) return {
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
   
    return {
      title: `${resourcepack.title} Resource Pack for Minecraft ${(resourcepack.files[0]) ? resourcepack.files[0].minecraftVersion : ""} on MCCreations`,
      description: resourcepack.shortDescription,
      openGraph: {
        title: `${resourcepack.title} Resource Pack for Minecraft ${(resourcepack.files[0]) ? resourcepack.files[0].minecraftVersion : ""} on MCCreations`,
        description: resourcepack.shortDescription,
        images: [
          ...resourcepack.images
        ],
        siteName: "MCCreations",
        type: "article",
        url: "https://mccreations.net/resourcepacks/" + resourcepack.slug
      }
    }
  }


export async function generateStaticParams() {
    let locale = getStaticParams();
    const maps = (await searchContent({contentType: CollectionNames.Resourcepacks}, false)).documents
    let mapParams =  maps.map((map: IContentDoc) => ({
        slug: map.slug
    }))
    locale = locale.concat(mapParams)
    return locale
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