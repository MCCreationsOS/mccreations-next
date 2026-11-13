import { AllTags, ContentTypes, SortOptions } from "@/app/api/types"
import { MetadataRoute } from "next"
import { localizedAlternates, SITE_URL } from "@/app/sitemapUtils"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const contentTypes = [ContentTypes.Maps, ContentTypes.Resourcepacks, ContentTypes.Datapacks]
    const options = [SortOptions.Newest, SortOptions.Updated, SortOptions.HighestDownloads, SortOptions.HighestRated, ...AllTags]

    return contentTypes.flatMap((type) => options.map((option) => ({
        url: `${SITE_URL}/en-US/content/${type}/${option}`,
        changeFrequency: 'weekly' as const,
        alternates: localizedAlternates(`/content/${type}/${option}`)
    })))
}
