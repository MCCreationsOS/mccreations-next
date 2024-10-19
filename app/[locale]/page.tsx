import Menu from "@/components/Menu/Menu"
import FeaturedSlideshow from "@/components/FeaturedSlideshow/FeaturedSlideshow";
import { searchContent } from "@/app/api/content";
import './styles/homepage.css'
import { QueryOptions, SortOptions } from "../api/types";
import ContentArea from "@/components/ContentArea/ContentArea";
import { Suspense } from "react";
import GridSkeleton from "@/components/skeletons/GridSkeleton";
import { AdsenseComponent } from "@/components/AdUnits/InContent";
import { getTranslations } from "next-intl/server";

export const dynamic = 'force-dynamic'

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations();
    let dynamicPlaylists: { name: string, id: string, options: QueryOptions }[] = [{
        name: t('Home.Playlists.parkour'),
        id: "parkour",
        options: { contentType: "content", status: 2, sort: SortOptions.Newest, limit: 20, search: "parkour" }
    }, {
        name: t('Home.Playlists.adventure'),
        id: "adventure",
        options: { contentType: "content", status: 2, sort: SortOptions.Updated, limit: 20, search: "adventure" }
    }, {
        name: t('Home.Playlists.puzzle'),
        id: "puzzle",
        options: { contentType: "content", status: 2, sort: SortOptions.Updated, limit: 20, search: "puzzle" }
    }, {
        name: t('Home.Playlists.highly_rated'), 
        id: "highly_rated",
        options: { contentType: 'content', status: 2, sort: SortOptions.HighestRated, limit: 20 }
    }, {
        name: t('Home.Playlists.popular'), 
        id: "popular",
        options: { contentType: 'content', status: 2, sort: SortOptions.HighestDownloads, limit: 20 }
    }]
    dynamicPlaylists.sort(() => Math.random() - 0.5)

    const featured = (await searchContent({ contentType: "content", status: 3, limit: 5 }, false)).documents
    return (
        <>
            <Menu selectedPage='home'></Menu>
            {(featured) ? (<FeaturedSlideshow content={featured} />) : "MCCreations API Error"}
            <h2 className="playlist_header">{t('Home.Playlists.new_content')}</h2>
            <Suspense fallback={<GridSkeleton amount={4} />}>
                <ContentArea type="scroll" playlist="new_content" options={{ contentType: "content", status: 2, sort: SortOptions.Newest, limit: 20 }} />
            </Suspense>
            <h2 className="playlist_header">{t('Home.Playlists.updated_content')}</h2>
            <Suspense fallback={<GridSkeleton amount={4} />}>
                <ContentArea type="scroll" playlist="updated_content" options={{ contentType: "content", status: 2, sort: SortOptions.Updated, limit: 20 }} filterOptions={{ contentType: "content", status: 2, sort: SortOptions.Newest, limit: 5 }} />
            </Suspense>
            <AdsenseComponent adSlot={"3283646290"} adClient={"ca-pub-5425604215170333"} adFormat={"auto"} adLayout={undefined} width={"1000px"} height={"100px"} />
            {dynamicPlaylists.map((playlist, index) => {
                return (
                    <div key={index}>
                        <h2 className="playlist_header">{playlist.name}</h2>
                        <Suspense fallback={<GridSkeleton amount={4} />}>
                            <ContentArea type="scroll" playlist={playlist.id} options={playlist.options} filterOptions={{ contentType: "content", status: 2, sort: SortOptions.Newest, limit: 5 }}/>
                        </Suspense>
                    </div>
                )
            })}
        </>
    )
}