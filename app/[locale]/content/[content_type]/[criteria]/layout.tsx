import { MinecraftVersions, SortOptions, StatusOptions, AllTags, ContentTypes } from "@/app/api/types"
import Menu from "@/components/Menu/Navbar"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Suspense } from "react"

export async function generateStaticParams() {
    const contentTypes = [ContentTypes.Maps + "s", ContentTypes.Resourcepacks + "s", ContentTypes.Datapacks + "s"]
    const options = [SortOptions.Newest, SortOptions.Updated, SortOptions.HighestDownloads, SortOptions.HighestRated, `${StatusOptions.Approved}`, `${StatusOptions.Unapproved}`, `${StatusOptions.Featured}`, ...AllTags]

    let params = []
    for (let type of contentTypes) {
        for (let option of options) {
            params.push({
                locale: "en-US",
                content_type: type,
                criteria: option
            })
        }
    }
    // console.log(params)
    return params
}

export async function generateMetadata(props: {params: Promise<{locale: string, content_type: string, criteria: string}>}) {
    const params = await props.params;
    const t = await getTranslations()
    const criteria = params.criteria
    let content_type = params.content_type
    if(content_type.includes("s")) {
        content_type = content_type.slice(0, -1)
    }


    if (MinecraftVersions.includes(criteria)) {
        return {
            title: t('Pages.Content.content_type.criteria.title', {content_type: content_type, minecraft_version: criteria}),
            description: t('Pages.Content.content_type.criteria.description', {content_type: content_type, minecraft_version: criteria}),
            keywords: [t('Pages.Content.content_type.criteria.Keywords.minecraft'), t(content_type, {count: 2}), t('Pages.Content.content_type.criteria.Keywords.games'), t('Pages.Content.content_type.criteria.Keywords.gaming'), t('Pages.Content.content_type.criteria.Keywords.minecraft_map'), t('Pages.Content.content_type.criteria.Keywords.minecraft_creations'), t('Pages.Content.content_type.criteria.Keywords.minecraft_version', {minecraft_version: criteria})],
            publisher: "MCCreations",
        }
    }

    if (AllTags.includes(criteria)) {
        return {
            title: t('Pages.Content.content_type.criteria.title', {content_type: content_type, criteria: criteria}),
            description: t('Pages.Content.content_type.criteria.description', {content_type: content_type, criteria: criteria}),
            keywords: [t('Pages.Content.content_type.criteria.Keywords.minecraft'), t(content_type, {count: 2}), t('Pages.Content.content_type.criteria.Keywords.games'), t('Pages.Content.content_type.criteria.Keywords.gaming'), t('Pages.Content.content_type.criteria.Keywords.minecraft_map'), t('Pages.Content.content_type.criteria.Keywords.minecraft_creations'), t(`Components.Creations.Tags.${criteria}`)],
            publisher: "MCCreations",
        }
    }

    switch (criteria) {
        case "newest":
            return {
                title: `Newest ${t(content_type, {count: 2})} for Minecraft | MCCreations`,
                description: `Browse the newest ${t(content_type, {count: 2})} on MCCreations`,
                keywords: [t('Pages.Content.content_type.criteria.Keywords.minecraft'), t(content_type, {count: 2}), t('Pages.Content.content_type.criteria.Keywords.games'), t('Pages.Content.content_type.criteria.Keywords.gaming'), t('Pages.Content.content_type.criteria.Keywords.minecraft_map'), t('Pages.Content.content_type.criteria.Keywords.minecraft_creations'), criteria],
                publisher: "MCCreations",
            }
        case "updated":
            return {
                title: `Updated ${t(content_type, {count: 2})} for Minecraft | MCCreations`,
                description: `Browse recently updated ${t(content_type, {count: 2})} on MCCreations`,
                keywords: [t('Pages.Content.content_type.criteria.Keywords.minecraft'), t(content_type, {count: 2}), t('Pages.Content.content_type.criteria.Keywords.games'), t('Pages.Content.content_type.criteria.Keywords.gaming'), t('Pages.Content.content_type.criteria.Keywords.minecraft_map'), t('Pages.Content.content_type.criteria.Keywords.minecraft_creations'), criteria],
                publisher: "MCCreations",
            }
        case "highest_downloads":
            return {
                title: `Most Downloaded ${t(content_type, {count: 2})} for Minecraft | MCCreations`,
                description: `Browse ${t(content_type, {count: 2})} with the most downloads on MCCreations`,
                keywords: [t('Pages.Content.content_type.criteria.Keywords.minecraft'), t(content_type, {count: 2}), t('Pages.Content.content_type.criteria.Keywords.games'), t('Pages.Content.content_type.criteria.Keywords.gaming'), t('Pages.Content.content_type.criteria.Keywords.minecraft_map'), t('Pages.Content.content_type.criteria.Keywords.minecraft_creations'), criteria],
                publisher: "MCCreations",
            }
        case "highest_rated":
            return {
                title: `Highest Rated ${t(content_type, {count: 2})} for Minecraft | MCCreations`,
                description: `Browse ${t(content_type, {count: 2})} with the highest ratings on MCCreations`,
                keywords: [t('Pages.Content.content_type.criteria.Keywords.minecraft'), t(content_type, {count: 2}), t('Pages.Content.content_type.criteria.Keywords.games'), t('Pages.Content.content_type.criteria.Keywords.gaming'), t('Pages.Content.content_type.criteria.Keywords.minecraft_map'), t('Pages.Content.content_type.criteria.Keywords.minecraft_creations'), criteria],
                publisher: "MCCreations",
            }
        case "1":
            return {
                title: `Published ${t(content_type, {count: 2})} for Minecraft | MCCreations`,
                description: `Browse published ${t(content_type, {count: 2})} on MCCreations`,
                keywords: [t('Pages.Content.content_type.criteria.Keywords.minecraft'), t(content_type, {count: 2}), t('Pages.Content.content_type.criteria.Keywords.games'), t('Pages.Content.content_type.criteria.Keywords.gaming'), t('Pages.Content.content_type.criteria.Keywords.minecraft_map'), t('Pages.Content.content_type.criteria.Keywords.minecraft_creations'), criteria],
                publisher: "MCCreations",
            }
        case "2":
            return {
                title: `Verified ${t(content_type, {count: 2})} for Minecraft | MCCreations`,
                description: `Browse verified ${t(content_type, {count: 2})} on MCCreations`,
                keywords: [t('Pages.Content.content_type.criteria.Keywords.minecraft'), t(content_type, {count: 2}), t('Pages.Content.content_type.criteria.Keywords.games'), t('Pages.Content.content_type.criteria.Keywords.gaming'), t('Pages.Content.content_type.criteria.Keywords.minecraft_map'), t('Pages.Content.content_type.criteria.Keywords.minecraft_creations'), criteria],
                publisher: "MCCreations",
            }
        case '3':
            return {
                title: `Featured ${t(content_type, {count: 2})} for Minecraft | MCCreations`,
                description: `Browse featured ${t(content_type, {count: 2})} on MCCreations`,
                keywords: [t('Pages.Content.content_type.criteria.Keywords.minecraft'), t(content_type, {count: 2}), t('Pages.Content.content_type.criteria.Keywords.games'), t('Pages.Content.content_type.criteria.Keywords.gaming'), t('Pages.Content.content_type.criteria.Keywords.minecraft_map'), t('Pages.Content.content_type.criteria.Keywords.minecraft_creations'), criteria],
                publisher: "MCCreations",
            }
        default:
            return {
                title: `MCCreations | ${t(content_type, {count: 2})}`,
                description: `Browse ${t(content_type, {count: 2})} on MCCreations`,
                keywords: [t('Pages.Content.content_type.criteria.Keywords.minecraft'), t(content_type, {count: 2}), t('Pages.Content.content_type.criteria.Keywords.games'), t('Pages.Content.content_type.criteria.Keywords.gaming'), t('Pages.Content.content_type.criteria.Keywords.minecraft_map'), t('Pages.Content.content_type.criteria.Keywords.minecraft_creations')],
                publisher: "MCCreations",
            }
    }
}

export default async function StaticContentPageLayout(props: {children: React.ReactNode, params: Promise<{locale: string, content_type: string, criteria: string}>}) {
    const params = await props.params;

    const {
        children
    } = props;

    setRequestLocale(params.locale)

    return (
           <Suspense>
               {children}
           </Suspense>
   )
}