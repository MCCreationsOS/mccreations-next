import '../../styles/mapPage.css'
import { fetchMap, fetchMaps } from '../../api/content';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { ICreator, IFile, IMap } from '@/app/types';
import MapWrapper from '@/components/Content/ContentWrapper';
import { Metadata, ResolvingMetadata } from 'next';
import { sendLog } from '@/app/api/logging';

export async function generateMetadata(
{ params }: {params: Params},
parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const id = params.id
   
    // fetch data
    const map: IMap = await fetchMap(params.slug)

    if(!map || !map.images) return {
        title: "Map Not Found",
        openGraph: {
            title: "Map Not Found",
            description: "Map Not Found",
            images: [
            {
                url: "https://next.mccreations.net/images/logo.png"
            }
            ],
            siteName: "MCCreations",
            type: "article",
            url: "https://next.mccreations.net/maps/" + params.slug
        }
    }
   
    return {
      title: map.title + " on MCCreations",
      openGraph: {
        title: map.title + " on MCCreations",
        description: map.shortDescription,
        images: [
          ...map.images
        ],
        siteName: "MCCreations",
        type: "article",
        url: "https://next.mccreations.net/maps/" + map.slug
      }
    }
  }


export async function generateStaticParams() {
    const maps = (await fetchMaps({}, false)).documents
    return maps.map((map: IMap) => ({
        slug: map.slug
    }))
}

export default async function Page({params}: {params: Params}) {
    const map = await fetchMap(params.slug)

    
    if(map) {
        return (
            <MapWrapper map={map} slug={params.slug}/>
        )
    } else {
        sendLog("Map Page", "")
        return (
            <div>
                <h1>Map Not Found</h1>
            </div>
        )
    }

}