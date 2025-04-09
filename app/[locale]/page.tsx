
import { searchContent } from "@/app/api/content";
import { CollectionNames, QueryOptions, SortOptions } from "../api/types";
import { AdsenseComponent } from "@/components/AdUnits/InContent";
import { getTranslations } from "next-intl/server";
import { Layers, Map, Package } from "lucide-react";
import { Link } from "../api/navigation";
import { Button } from "@/components/ui/button";
import ContentGrid from "@/components/Creations/Grid";

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
            {/* {(featured) ? (<FeaturedSlideshow content={featured} />) : "MCCreations API Error"} */}
            <AdsenseComponent adSlot={"3283646290"} adClient={"ca-pub-5425604215170333"} adFormat={"auto"} adLayout={undefined} width={"1000px"} height={"100px"}/>
            <UpdatedCreations />
            <h2 className="view_all_header">{t('Home.ViewAll')}</h2>
            <div className="view_all_buttons">
                <Link href={`/maps`}><Button><Map />{t('map', { count: 2})}</Button></Link>
                <Link href={`/datapacks`}><Button><Package />{t('datapack', { count: 2})}</Button></Link>
                <Link href={`/resourcepacks`}><Button><Layers />{t('resourcepack', { count: 2})}</Button></Link>
            </div>
        </>
    )
}

async function UpdatedCreations() {
    const t = await getTranslations();
    const creations = (await searchContent({ contentType: "content", status: 2, sort: SortOptions.Updated, limit: 19 }, false)).documents
    return (
        <ContentGrid content={creations} />
    )
}