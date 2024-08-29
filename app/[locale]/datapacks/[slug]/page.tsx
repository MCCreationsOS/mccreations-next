import '../../styles/mapPage.css'
import { searchContent, fetchDatapack } from '@/app/api/content';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { ICreator, IFile, IContentDoc, CollectionNames } from '@/app/api/types';
import MapWrapper, { DatapackWrapper } from '@/components/Content/ContentWrapper';
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
    const datapack: IContentDoc = await fetchDatapack(params.slug)

    if(!datapack || !datapack.images) return {
        title: "Datapack Not Found",
        openGraph: {
            title: "Datapack Not Found",
            description: "Datapack Not Found",
            images: [
            {
                url: "https://mccreations.net/images/logo.png"
            }
            ],
            siteName: "MCCreations",
            type: "article",
            url: "https://mccreations.net/datapacks/" + params.slug
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
        url: "https://mccreations.net/datapacks/" + datapack.slug
      }
    }
  }


export async function generateStaticParams() {
    let locale = getStaticParams();
    const maps = (await searchContent({contentType: CollectionNames.Datapacks}, false)).documents
    let mapParams =  maps.map((map: IContentDoc) => ({
        slug: map.slug
    }))
    locale = locale.concat(mapParams)
    return locale
}

export default async function Page({params}: {params: Params}) {
    setStaticParamsLocale(params.locale);
    const map = await fetchDatapack(params.slug)
    const t = await getI18n()
    
    if(map && '_id' in map) {
        return (
            <Content content={map} collectionName={CollectionNames.Datapacks}/>
        )
    } else if (map) {
        return (
            <DatapackWrapper datapack={map} slug={params.slug}/>
        )
    }  else {
        sendLog("Datapack Page", "")
        return (
            <div className='centered_content'>
                <h1>{t('content.datapack_not_found')}</h1>
            </div>
        )
    }

}