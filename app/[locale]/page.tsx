
import { searchContent } from "@/app/api/content";
import { CollectionNames, QueryOptions, SortOptions } from "../api/types";
import { AdsenseComponent } from "@/components/AdUnits/InContent";
import { getTranslations } from "next-intl/server";
import { Layers, Map, Package } from "lucide-react";
import { Link } from "../api/navigation";
import { Button } from "@/components/ui/button";
import ContentGrid from "@/components/Creations/Grid";
import FeaturedSlideshow from "@/components/Creations/FeaturedSlideshow";

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations();
    let dynamicPlaylists: { name: string, id: string, options: QueryOptions }[] = [{
        name: 'updated_content',
        id: "updated_content",
        options: { contentType: 'content', status: 2, sort: SortOptions.Updated, limit: 19 }
    }]
    dynamicPlaylists.sort(() => Math.random() - 0.5)

    const featured = (await searchContent({ contentType: "content", status: 3, limit: 5 }, false)).documents
    return (
        <>
            <div className="bg-linear-to-b from-blue-500 to-blue-800 w-full mb-5">
                <h1 className="text-white text-4xl font-brand text-center pt-7">MCCreations</h1>
                <p className="text-white text-center text-xl pb-7">{t('Home.blurb')}</p>
            </div>
            <FeaturedSlideshow creations={featured} />
            <div className="relative">
                <AdsenseComponent adSlot={"3283646290"} adClient={"ca-pub-5425604215170333"} adFormat={"auto"} adLayout={undefined} width={"1000px"} height={"100px"}/>
            </div>
            <div className="p-2">
                <h2 className="text-2xl font-bold mt-5 mb-2">{t('Home.recently_updated')}</h2>
                <UpdatedCreations />
            </div>
            <h2 className="w-full text-center text-2xl font-bold mt-5 mb-2">{t('Home.view_all')}</h2>
            <div className="w-full flex justify-center gap-2 mb-10">
                <Link href={`/maps`}><Button><Map />{t('map', { count: 2})}</Button></Link>
                <Link href={`/datapacks`}><Button><Package />{t('datapack', { count: 2})}</Button></Link>
                <Link href={`/resourcepacks`}><Button><Layers />{t('resourcepack', { count: 2})}</Button></Link>
            </div>
        </>
    )
}

async function UpdatedCreations() {
    const t = await getTranslations();
    const creations = (await searchContent({ contentType: "content", status: 2, sort: SortOptions.Updated, limit: 20 }, false)).documents
    return (
        <ContentGrid content={creations} />
    )
}