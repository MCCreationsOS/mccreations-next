import { convertToCollection } from "@/app/api/content";
import { AllTags, ContentTypes, MinecraftVersions, SortOptions, StatusOptions } from "@/app/api/types";
import CreationSearchPage from "@/components/Creations/Search/CreationSearchPage";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

export default async function Page(props: {params: Promise<{locale: string, content_type: string, criteria: string}>, searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) {
    const params = await props.params;
    const query = await props.searchParams;
    setRequestLocale(params.locale)
    const criteria = params.criteria
    const contentType = params.content_type as ContentTypes
    let sort = SortOptions.Newest
    let status = StatusOptions.Approved
    let include = ""
    let search = ""

    if (MinecraftVersions.includes(criteria)) {
        sort = SortOptions.Newest
        status = StatusOptions.Approved
        include = ""
        search = criteria
    }

    const isTag = AllTags.includes(criteria)
    if (isTag) {
        sort = SortOptions.Newest
        status = StatusOptions.Approved
        include = criteria
        search = ""
    }

    // Anything that isn't a tag or a sort keyword (handled below) is treated as a search term
    if (search === "" && !isTag) {
        search = criteria
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
        case "1":
            sort = SortOptions.Newest
            status = StatusOptions.Unapproved
            include = ""
            search = ""
            break
        case "2":
            sort = SortOptions.Newest
            status = StatusOptions.Featured
            include = ""
            search = ""
            break
        case "3":
            sort = SortOptions.Newest
            status = StatusOptions.Featured
            include = ""
            search = ""
            break
    }


    const searchParams = Promise.resolve({
        search: search,
        sort: sort,
        status: status.toString(),
        includeTags: include,
        excludeTags: "",
        page: "0",
        ...query,
    })

    return (
        <CreationSearchPage searchParams={searchParams} collectionName={convertToCollection(contentType)} pathname={`/${params.locale}/content/${contentType}/${criteria}`} locale={params.locale} />
    )
}