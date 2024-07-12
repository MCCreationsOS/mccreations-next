import '../../styles/mapPage.css'
import { fetchContent, fetchDatapack } from '@/app/api/content';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { ICreator, IFile, IContentDoc, ContentTypes } from '@/app/api/types';
import MapWrapper, { DatapackWrapper } from '@/components/Content/ContentWrapper';
import { Metadata, ResolvingMetadata } from 'next';
import { sendLog } from '@/app/api/logging';
import { getI18n } from '@/locales/server';

export async function generateMetadata(
{ params }: {params: Params},
parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const id = params.id
    // fetch data
    const datapack: IContentDoc = await fetchDatapack(params.slug)

    if(!datapack || !datapack.images) return {
        title: "Datapack Not Found",
        openGraph: {
            title: "Datapack Not Found",
            description: "Datapack Not Found",
            images: [
            {
                url: "https://next.mccreations.net/images/logo.png"
            }
            ],
            siteName: "MCCreations",
            type: "article",
            url: "https://next.mccreations.net/datapacks/" + params.slug
        }
    }
   
    return {
      title: `${datapack.title} Data Pack for Minecraft ${datapack.files[0].minecraftVersion} on MCCreations`,
      openGraph: {
        title: `${datapack.title} Data Pack for Minecraft ${datapack.files[0].minecraftVersion} on MCCreations`,
        description: datapack.shortDescription,
        images: [
          ...datapack.images
        ],
        siteName: "MCCreations",
        type: "article",
        url: "https://next.mccreations.net/datapacks/" + datapack.slug
      }
    }
  }


export async function generateStaticParams() {
    const maps = (await fetchContent({contentType: ContentTypes.Datapacks}, false)).documents
    return maps.map((map: IContentDoc) => ({
        slug: map.slug
    }))
}

export default async function Page({params}: {params: Params}) {
    const map = await fetchDatapack(params.slug)
    const t = await getI18n()
    
    if(map) {
        return (
            <DatapackWrapper datapack={map} slug={params.slug}/>
        )
    } else {
        sendLog("Datapack Page", "")
        return (
            <div>
                <h1>{t('content.datapack_not_found')}</h1>
            </div>
        )
    }

}