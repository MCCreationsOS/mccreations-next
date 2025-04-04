import { convertToCollection, searchContent } from "@/app/api/content";
import { AllTags, ContentTypes, MinecraftVersions, SortOptions, StatusOptions } from "@/app/api/types";
import ContentSearchPage from "@/components/Content/Search/ContentSearchPage";
import { unstable_setRequestLocale } from "next-intl/server";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { Suspense } from "react";

export default async function Page({params}: {params: Params}) {
    unstable_setRequestLocale(params.locale)
    const criteria = params.criteria
    const contentType = params.content_type as ContentTypes
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

    if(search === "") {
        search = criteria
    }

    // defaultContent = (await searchContent({contentType: convertToCollection(contentType), sort: sort, status: status, includeTags: include, excludeTags: "", limit: 20, page: 0}, false)).documents
    
    return (
        <ContentSearchPage searchParams={{page: "0", search: search, sort: sort, status: status.toString(), includeTags: include, excludeTags: ""}} collectionName={convertToCollection(contentType)} pathname={`/${params.locale}/content/${contentType}/${criteria}`} />
    )
}