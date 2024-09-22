import { Locales, MinecraftVersions, SortOptions, StatusOptions, AllTags, ContentTypes } from "@/app/api/types"
import Menu from "@/components/Menu/Menu"
import { getTranslations, unstable_setRequestLocale } from "next-intl/server"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"
import { Suspense } from "react"

export async function generateStaticParams() {
    const contentTypes = [ContentTypes.Maps + "s", ContentTypes.Resourcepacks + "s", ContentTypes.Datapacks + "s"]
    const options = [SortOptions.Newest, SortOptions.Updated, SortOptions.HighestDownloads, SortOptions.HighestRated, `${StatusOptions.Approved}`, `${StatusOptions.Unapproved}`, `${StatusOptions.Featured}`, ...MinecraftVersions, ...AllTags]

    let params = []
    for (let locale of Locales) {
        for (let type of contentTypes) {
            for (let option of options) {
                params.push({
                    locale: locale,
                    content_type: type,
                    criteria: option
                })
            }
        }
    }
    // console.log(params)
    return params
}

export async function generateMetadata({params}: {params: Params}) {
    const t = await getTranslations()
    const criteria = params.criteria
    let content_type = params.content_type
    if(content_type.includes("s")) {
        content_type = content_type.slice(0, -1)
    }
    

    if (MinecraftVersions.includes(criteria)) {
        return {
            title: `Minecraft ${criteria} ${t(content_type, {count: 2})} | MCCreations`,
            description: `Browse ${t(content_type, {count: 2})} for Minecraft ${criteria} on MCCreations`
        }
    }

    if (AllTags.includes(criteria)) {
        return {
            title: `${t(`Content.Tags.${criteria}`)} ${t(content_type, {count: 2})} | MCCreations`,
            description: `Browse ${criteria} ${t(content_type, {count: 2})}s on MCCreations`
        }
    }
    
    switch (criteria) {
        case "newest":
            return {
                title: `Newest ${t(content_type, {count: 2})} | MCCreations`,
                description: `Browse the newest ${t(content_type, {count: 2})} on MCCreations`
            }
        case "updated":
            return {
                title: `Updated ${t(content_type, {count: 2})} | MCCreations`,
                description: `Browse recently updated ${t(content_type, {count: 2})} on MCCreations`
            }
        case "highest_downloads":
            return {
                title: `Highest Downloads ${t(content_type, {count: 2})} | MCCreations`,
                description: `Browse ${t(content_type, {count: 2})} with the most downloads on MCCreations`
            }
        case "highest_rated":
            return {
                title: `Highest Rated ${t(content_type, {count: 2})} | MCCreations`,
                description: `Browse ${t(content_type, {count: 2})} with the highest ratings on MCCreations`
            }
        case 1:
            return {
                title: `Published ${t(content_type, {count: 2})} | MCCreations`,
                description: `Browse published ${t(content_type, {count: 2})} on MCCreations`
            }
        case 2:
            return {
                title: `Verified ${t(content_type, {count: 2})} | MCCreations`,
                description: `Browse verified ${t(content_type, {count: 2})} on MCCreations`
            }
        case 3:
            return {
                title: `Featured ${t(content_type, {count: 2})} | MCCreations`,
                description: `Browse featured ${t(content_type, {count: 2})} on MCCreations`
            }
    }
}

export default function StaticContentPageLayout({ children, params }: {children: React.ReactNode, params: Params}) {
    unstable_setRequestLocale(params.locale)
  
   return (
          <Suspense>
            <Menu selectedPage={params.content_type}></Menu>
              {children}
          </Suspense>
  )
}