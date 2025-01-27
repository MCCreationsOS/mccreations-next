import ContentGrid from "@/components/Grids/ContentGrid"
import Menu from "@/components/Menu/Menu"
import { useSearchParams, usePathname } from "next/navigation"
import Link from "next/link";
import { convertToType, fetchTags, searchContent } from "@/app/api/content"
import SearchAndFilter from "@/components/SearchAndFilter"
import {useTranslations} from 'next-intl';
import { AdsenseComponent } from "@/components/AdUnits/InContent"
import SidebarFilters from "@/components/SearchAndFilter/SidebarFilters"
import { getTranslations } from "next-intl/server";
import { CollectionNames, SortOptions, StatusOptions } from "@/app/api/types";
import PageNavigator from "./Navigator";

export const dynamic = "force-dynamic"

export default async function ContentSearchPage({searchParams, collectionName, pathname}: {searchParams: {page: string, search: string, sort: string, status: string, includeTags: string, excludeTags: string}, collectionName: CollectionNames, pathname: string}) {
    const t = await getTranslations()
    let contentType = convertToType(collectionName)
    let page = 0
    if(searchParams.page != null && searchParams.page.length > 0) {
       page = (Number.parseInt(searchParams.page));
    }
    let search = searchParams.search ?? ""
    let sort = searchParams.sort ? searchParams.sort as SortOptions : SortOptions.Newest
    let status = searchParams.status ? Number.parseInt(searchParams.status) : StatusOptions.Approved
    let includeTags = searchParams.includeTags ?? ""
    let excludeTags = searchParams.excludeTags ?? ""

    let documents = await searchContent({contentType: collectionName, sort: sort, limit: 19, page: page, search: search, status: status, includeTags: includeTags, excludeTags: excludeTags}, false)
    let pages = Math.ceil(documents.totalCount / 20.0)
    let creations = documents.documents

    let tags = await fetchTags(contentType)
    
    return (
        <div>
            <SearchAndFilter contentType={collectionName} tags={tags}/>
            { creations && creations.length !== 0 && (
                <div className="page_with_sidebar">
                    <SidebarFilters contentType={collectionName} tags={tags} />
                    <ContentGrid content={creations} enableSelection={true} enableAds={true} showCategory={true}></ContentGrid>
                </div>
            )}
            { !creations || creations.length === 0 && (
                <div className="no_comments">
                    <h2>{t('Content.maps_not_found')}</h2>
                </div>
            )}
            { creations && pages > 1 &&  (<PageNavigator page={page} pages={pages} />) }
            <AdsenseComponent adSlot={"3283646290"} adClient={"ca-pub-5425604215170333"} adFormat={"auto"} adLayout={undefined} width={"1000px"} height={"100px"}/>
        </div>
    )
}