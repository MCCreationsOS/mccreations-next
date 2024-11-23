import Menu from "@/components/Menu/Menu"
import FeaturedSlideshow from "@/components/FeaturedSlideshow/FeaturedSlideshow";
import { searchContent } from "@/app/api/content";
import './styles/homepage.css'
import { CollectionNames, QueryOptions, SortOptions } from "../api/types";
import ContentArea from "@/components/ContentArea/ContentArea";
import { Suspense } from "react";
import GridSkeleton from "@/components/skeletons/GridSkeleton";
import { AdsenseComponent } from "@/components/AdUnits/InContent";
import { getTranslations } from "next-intl/server";
import MainButton from "@/components/Buttons/MainButton";
import { Layers, Map, Package } from "react-feather";
import HomepageFeed from "@/components/Feed/HomepageFeed";
import { Link } from "../api/navigation";

export const dynamic = 'force-dynamic'

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
            {(featured) ? (<FeaturedSlideshow content={featured} />) : "MCCreations API Error"}
            <AdsenseComponent adSlot={"3283646290"} adClient={"ca-pub-5425604215170333"} adFormat={"auto"} adLayout={undefined} width={"1000px"} height={"100px"}/>
            <ContentArea type="grid" options={dynamicPlaylists[0].options} enableAds={true}/>
            <h2 className="view_all_header">{t('Home.ViewAll')}</h2>
            <div className="view_all_buttons">
                <Link href={`/maps`}><MainButton><Map />{t('map', { count: 2})}</MainButton></Link>
                <Link href={`/datapacks`}><MainButton><Package />{t('datapack', { count: 2})}</MainButton></Link>
                <Link href={`/resourcepacks`}><MainButton><Layers />{t('resourcepack', { count: 2})}</MainButton></Link>
            </div>
        </>
    )
}