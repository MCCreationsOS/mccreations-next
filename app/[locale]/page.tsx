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

export const dynamic = 'force-dynamic'

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations();
    let dynamicPlaylists: { name: string, id: string, options: QueryOptions }[] = [{
        name: 'parkour',
        id: "parkour",
        options: { contentType: "content", status: 2, sort: SortOptions.Newest, limit: 20, includeTags: "parkour" }
    }, {
        name: 'adventure',
        id: "adventure",
        options: { contentType: "content", status: 2, sort: SortOptions.Updated, limit: 20, includeTags: "adventure" }
    }, {
        name: 'puzzle',
        id: "puzzle",
        options: { contentType: "content", status: 2, sort: SortOptions.Updated, limit: 20, includeTags: "puzzle" }
    }, {
        name: 'highly_rated',
        id: "highly_rated",
        options: { contentType: 'content', status: 2, sort: SortOptions.HighestRated, limit: 20 }
    }, {
        name: 'popular',
        id: "popular",
        options: { contentType: 'content', status: 2, sort: SortOptions.HighestDownloads, limit: 20 }
    }, {
        name: 'new_content',
        id: "new_content",
        options: { contentType: 'content', status: 2, sort: SortOptions.Newest, limit: 20 }
    }, {
        name: 'updated_content',
        id: "updated_content",
        options: { contentType: 'content', status: 2, sort: SortOptions.Updated, limit: 20 }
    }, {
        name: 'builds',
        id: "builds",
        options: { contentType: 'content', status: 2, sort: SortOptions.Newest, limit: 20, includeTags: "build" }
    }, {
        name: 'maps',
        id: "maps",
        options: { contentType: CollectionNames.Maps, status: 2, sort: SortOptions.Newest, limit: 20 }
    }, {
        name: 'datapacks',
        id: "datapacks",
        options: { contentType: CollectionNames.Datapacks, status: 2, sort: SortOptions.Newest, limit: 20 }
    }, {
        name: 'resource_packs',
        id: "resource_packs",
        options: { contentType: CollectionNames.Resourcepacks, status: 2, sort: SortOptions.Newest, limit: 20 }
    }, {
        name: 'tools',
        id: "tools",
        options: { contentType: "content", status: 2, sort: SortOptions.Newest, limit: 20, includeTags: "tool" }
    }, {
        name: 'challenges',
        id: "challenges",
        options: { contentType: "content", status: 2, sort: SortOptions.Newest, limit: 20, includeTags: "challenge" }
    }]
    dynamicPlaylists.sort(() => Math.random() - 0.5)

    const featured = (await searchContent({ contentType: "content", status: 3, limit: 5 }, false)).documents
    return (
        <>
            {(featured) ? (<FeaturedSlideshow content={featured} />) : "MCCreations API Error"}
            <ContentArea type="grid" options={dynamicPlaylists[0].options} />
            <h2 className="view_all_header">{t('Home.ViewAll')}</h2>
            <div className="view_all_buttons">
                <MainButton><Map />{t('map', { count: 2})}</MainButton>
                <MainButton><Package />{t('datapack', { count: 2})}</MainButton>
                <MainButton><Layers />{t('resourcepack', { count: 2})}</MainButton>
            </div>
        </>
    )
}