import { convertToCollection, searchContent } from "@/app/api/content";
import { AllTags, ContentTypes, MinecraftVersions, SortOptions, StatusOptions } from "@/app/api/types";
import SearchPage from "@/components/Search/SearchPage";
import { unstable_setRequestLocale } from "next-intl/server";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { Suspense } from "react";

export default async function Page({params}: {params: Params}) {
    unstable_setRequestLocale(params.locale)
    const criteria = params.criteria
    const contentType = params.content_type
    let sort = SortOptions.Newest
    let status = StatusOptions.Approved
    let include = ""
    let search = ""
    
    let defaultContent = []

    if (MinecraftVersions.includes(criteria)) {
        sort = SortOptions.Newest
        status = StatusOptions.Approved
        include = ""
        search = criteria
    }

    if (AllTags.includes(criteria)) {
        sort = SortOptions.Newest
        status = StatusOptions.Approved
        include = criteria
        search = ""
    }
    
    switch (criteria) {
        case "newest":
            sort = SortOptions.Newest
            status = StatusOptions.Approved
            include = ""
            search = ""
            break
        case "updated":
            sort = SortOptions.Updated
            status = StatusOptions.Approved
            include = ""
            search = ""
            break
        case "highest_downloads":
            sort = SortOptions.HighestDownloads
            status = StatusOptions.Approved
            include = ""
            search = ""
            break
        case "highest_rated":
            sort = SortOptions.HighestRated
            status = StatusOptions.Approved
            include = ""
            search = ""
            break
        case 1:
            sort = SortOptions.Newest
            status = StatusOptions.Unapproved
            include = ""
            search = ""
            break
        case 2:
            sort = SortOptions.Newest
            status = StatusOptions.Featured
            include = ""
            search = ""
            break
        case 3:
            sort = SortOptions.Newest
            status = StatusOptions.Featured
            include = ""
            search = ""
            break
    }

    defaultContent = (await searchContent({contentType: convertToCollection(params.content_type as ContentTypes), sort: sort, status: status, includeTags: include, excludeTags: "", limit: 20, page: 0}, false)).documents
    
    return (
        <SearchPage defaultContent={defaultContent} contentType={params.content_type} sort={sort} status={status} include={include} exclude="" search={search} />
    )
}