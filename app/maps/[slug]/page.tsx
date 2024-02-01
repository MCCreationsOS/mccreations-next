import '../../styles/mapPage.css'
import { fetchMap, fetchMaps } from '../../api/content';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { ICreator, IFile, IMap } from '@/app/types';
import MapComp from '@/components/Map/Map';



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
            <MapComp map={map} slug={params.slug}/>
        )
    } else {
        return (
            <div>
                <h1>Map Not Found</h1>
            </div>
        )
    }

}