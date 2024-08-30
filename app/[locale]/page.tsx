import Menu from "@/components/Menu/Menu"
import ContentGrid from "@/components/ContentGrid";
import ContentCard from "@/components/ContentSlideshow/ContentCard";
import FeaturedSlideshow from "@/components/FeaturedSlideshow/FeaturedSlideshow";
import { searchContent } from "@/app/api/content";
import Error from "@/components/Error";
import ContentSlideshow from "@/components/ContentSlideshow/ContentSlideshow";
import './styles/homepage.css'
import { IContentDoc, SortOptions } from "../api/types";
import ContentArea from "@/components/ContentArea/ContentArea";
import { Suspense } from "react";
import GridSkeleton from "@/components/skeletons/GridSkeleton";
import { getCurrentLocale, getI18n, getStaticParams } from "@/locales/server";
import { setStaticParamsLocale } from 'next-international/server'
import { AdsenseComponent } from "@/components/AdUnits/InContent";

export function generateStaticParams() {
    return getStaticParams()
}

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
    setStaticParamsLocale(locale)
    const t = await getI18n()
    
    const featured = (await searchContent({contentType: "content", status: 3, limit: 5}, false)).documents
    if(!featured || featured.error) {
        let msgBase = "MCCreations API Error! Failed to fetch featured, newest or updated on the homepage. Query was "
        return (
            <>
                <Menu selectedPage='home'></Menu>
                <Error message={msgBase + JSON.stringify(featured.query)}></Error>
            </>
        )
    }
    return (
        <>
        <Menu selectedPage='home'></Menu>
        {(featured) ? (<FeaturedSlideshow content={featured} />) : "MCCreations API Error"}
        <h2 className="playlist_header">{t('playlist.new_content')}</h2>
        <Suspense fallback={<GridSkeleton amount={4} />}>
            <ContentArea type="scroll" playlist="new_content" options={{contentType: "content", status: 2, sort: SortOptions.Newest, limit: 20}} />
        </Suspense>
        <h2 className="playlist_header">{t('playlist.updated_content')}</h2>
        <Suspense fallback={<GridSkeleton amount={4} />}>
            <ContentArea type="scroll" playlist="updated_content" options={{contentType: "content", status: 2, sort: SortOptions.Updated, limit: 20}} filterOptions={{contentType: "content", status: 2, sort: SortOptions.Newest, limit: 5}}/>
        </Suspense>
        <AdsenseComponent adSlot={"3283646290"} adClient={"ca-pub-5425604215170333"} adFormat={"auto"} adLayout={undefined} width={"1000px"} height={"100px"}/>
        {/* <Suspense>
            <h2 className="playlist_header">Site Updates</h2>
            <iframe src="https://blog.mccreations.net/embed" width="480" height="320" frameBorder="0" scrolling="no"></iframe>
        </Suspense> */}
        </>
    )
}