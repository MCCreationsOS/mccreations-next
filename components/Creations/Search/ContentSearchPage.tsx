import ContentGrid from "@/components/Creations/Grid"
import { convertToType, fetchTags, searchContent } from "@/app/api/content"
import SearchAndFilter from "@/components/Creations/Search/SearchBar"
import { AdsenseComponent } from "@/components/AdUnits/InContent"
import SidebarFilters from "@/components/Creations/Search/SidebarFilters"
import { getTranslations } from "next-intl/server";
import { CollectionNames, SortOptions, StatusOptions } from "@/app/api/types";
import PageNavigator from "./Navigator";
import { makeSentenceCase } from "@/app/api/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

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
            <div className="mb-4 mt-2 p-2">
                <h1 className="text-2xl font-bold">{t(`Creations.Search.SearchPage.${contentType}.title`)}</h1>
                <Collapsible>
                    <CollapsibleTrigger><p className="text-sm text-gray-500">{t(`Creations.Search.SearchPage.${contentType}.blurb`)}</p></CollapsibleTrigger>
                    <CollapsibleContent>
                    <p className="text-sm text-gray-500">
                        {t(`Creations.Search.SearchPage.${contentType}.description`)}
                    </p>
                    </CollapsibleContent>
                </Collapsible>

            </div>
            { creations && creations.length !== 0 && (
                <div className="md:grid md:grid-cols-[300px_1fr] gap-4 p-2 @container">
                    <SidebarFilters contentType={collectionName} tags={tags} />
                    <div>
                        <SearchAndFilter searchParams={searchParams} tags={tags}/>
                        <ContentGrid content={creations} enableSelection={true} enableAds={true} showCategory={true}></ContentGrid>
                        { creations && pages > 1 &&  (<PageNavigator page={page} pages={pages} className="mt-4" />) }
                    </div>
                </div>
            )}
            { !creations || creations.length === 0 && (
                <div className="no_comments">
                    <h2>{t('Content.maps_not_found')}</h2>
                </div>
            )}
            <AdsenseComponent adSlot={"3283646290"} adClient={"ca-pub-5425604215170333"} adFormat={"auto"} adLayout={undefined} width={"1000px"} height={"100px"}/>
        </div>
    )
}