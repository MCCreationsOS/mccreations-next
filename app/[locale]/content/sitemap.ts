import { AllTags, CollectionNames, Locales, MinecraftVersions, SortOptions, StatusOptions } from "@/app/api/types"
import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const contentTypes = [CollectionNames.Maps, CollectionNames.Resourcepacks, CollectionNames.Datapacks]
    const options = [SortOptions.Newest, SortOptions.Updated, SortOptions.HighestDownloads, SortOptions.HighestRated, `verified`, `published`, `featured`, ...MinecraftVersions, ...AllTags]
    
    let sitemap: MetadataRoute.Sitemap = []


    for (let locale of Locales) {
        for (let type of contentTypes) {
            for (let option of options) {
                sitemap.push({
                    url: `https://mccreations.net/${locale}/content/${type}/${option}`,
                    lastModified: new Date().toISOString(),
                    changeFrequency: 'weekly',
                    alternates: {
                        languages: {
                            "zh-CN": `https://mccreations.net/zh-CN/content/${type}/${option}`,
                            "ru-RU": `https://mccreations.net/ru-RU/content/${type}/${option}`,
                            "en-US": `https://mccreations.net/en-US/content/${type}/${option}`,
                        }
                    }
                })
            }
        }
    }

    return sitemap
}