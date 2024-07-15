import '../../styles/mapPage.css'
import { searchContent, fetchDatapack, fetchResourcepack } from '@/app/api/content';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { ICreator, IFile, IContentDoc, ContentTypes } from '@/app/api/types';
import MapWrapper, { DatapackWrapper, ResourcepackWrapper } from '@/components/Content/ContentWrapper';
import { Metadata, ResolvingMetadata } from 'next';
import { sendLog } from '@/app/api/logging';
import { getI18n, getStaticParams } from '@/locales/server';
import Content from '@/components/Content/Content';

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
                url: "https://next.mccreations.net/images/logo.png"
            }
            ],
            siteName: "MCCreations",
            type: "article",
            url: "https://next.mccreations.net/resourcepacks/" + params.slug
        }
    }
   
    return {
      title: `${resourcepack.title} Resource Pack for Minecraft ${resourcepack.files[0].minecraftVersion} on MCCreations`,
      openGraph: {
        title: `${resourcepack.title} Resource Pack for Minecraft ${resourcepack.files[0].minecraftVersion} on MCCreations`,
        description: resourcepack.shortDescription,
        images: [
          ...resourcepack.images
        ],
        siteName: "MCCreations",
        type: "article",
        url: "https://next.mccreations.net/resourcepacks/" + resourcepack.slug
      }
    }
  }


export async function generateStaticParams() {
    getStaticParams();
    const maps = (await searchContent({contentType: ContentTypes.Resourcepacks}, false)).documents
    return maps.map((map: IContentDoc) => ({
        slug: map.slug
    }))
}

export default async function Page({params}: {params: Params}) {
    const map = await fetchResourcepack(params.slug)
    const t = await getI18n()
    
    if(map && '_id' in map) {
        return (
            <Content content={map} contentType={ContentTypes.Resourcepacks}/>
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