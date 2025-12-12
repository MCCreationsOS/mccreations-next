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

export default async function CreationSearchPage({ searchParams, collectionName, pathname, locale }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }>, collectionName: CollectionNames, pathname: string, locale: string }) {
    const t = await getTranslations({ locale: locale })
    let contentType = convertToType(collectionName)
    let page = 0
    const params = await searchParams
    if (params.page != null && params.page.length > 0) {
        page = (Number.parseInt(params.page as string));
    }
    let search = params.search ? params.search as string : ""
    let sort = params.sort ? params.sort as SortOptions : SortOptions.Newest
    let status = params.status ? Number.parseInt(params.status as string) : StatusOptions.Approved
    let includeTags = params.includeTags as string ?? ""
    let excludeTags = params.excludeTags as string ?? ""

    let documents = await searchContent({ contentType: collectionName, sort: sort, limit: 19, page: page, search: search as string, status: status, includeTags: includeTags as string, excludeTags: excludeTags as string }, false)
    let pages = Math.ceil(documents.totalCount / 19)
    let creations = documents.documents

    let tags = await fetchTags(contentType)

    return (
        <div>
            <div className="mb-4 mt-2 p-2">
                <h1 className="text-2xl font-bold">{t(`Components.Creations.Search.Headers.${contentType}.title`)}</h1>
                <Collapsible>
                    <CollapsibleTrigger><p className="text-sm text-gray-500">{t(`Components.Creations.Search.Headers.${contentType}.blurb`)}</p></CollapsibleTrigger>
                    <CollapsibleContent>
                        <p className="text-sm text-gray-500">
                            {t(`Components.Creations.Search.Headers.${contentType}.description`)}
                        </p>
                    </CollapsibleContent>
                </Collapsible>

            </div>
            <div className="md:grid md:grid-cols-[300px_1fr] gap-4 p-2 @container">
                <SidebarFilters contentType={collectionName} tags={tags} searchParams={{ search: search, sort: sort, status: status, includeTags: includeTags, excludeTags: excludeTags }} />
                <div>
                    <SearchAndFilter searchParams={{ search: search, sort: sort, status: status, includeTags: includeTags, excludeTags: excludeTags }} tags={tags} />
                    {creations && creations.length !== 0 && (
                        <>
                            <ContentGrid content={creations} enableSelection={true} enableAds={true} showCategory={true} playlist={collectionName}></ContentGrid>
                            {creations && pages > 1 && (<PageNavigator page={page} pages={pages} className="mt-4" />)}
                        </>
                    )}
                    {!creations || creations.length === 0 && (
                        <div className="no_comments">
                            <h2>{t('Components.Creations.Page.not_found', { content_type: t(contentType, { count: 2 }) })}</h2>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}