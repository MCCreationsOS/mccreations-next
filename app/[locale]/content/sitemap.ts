import { AllTags, ContentTypes, SortOptions } from "@/app/api/types"
import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const contentTypes = [ContentTypes.Maps, ContentTypes.Resourcepacks, ContentTypes.Datapacks]
    const options = [SortOptions.Newest, SortOptions.Updated, SortOptions.HighestDownloads, SortOptions.HighestRated, ...AllTags]
    
    let sitemap: MetadataRoute.Sitemap = []


    // for (let locale of Locales) {
        for (let type of contentTypes) {
            for (let option of options) {
                sitemap.push({
                    url: `https://mccreations.net/en-US/content/${type}/${option}`,
                    lastModified: new Date().toISOString(),
                    changeFrequency: 'weekly',
                    alternates: {
                        languages: {
                            "en": `https://mccreations.net/en-US/content/${type}/${option}`,
                            "zh-CN": `https://mccreations.net/zh-CN/content/${type}/${option}`,
                            "ru-RU": `https://mccreations.net/ru-RU/content/${type}/${option}`,
                            "nl-NL": `https://mccreations.net/nl-NL/content/${type}/${option}`,
                            "fr-FR": `https://mccreations.net/fr-FR/content/${type}/${option}`,
                            "hi-IN": `https://mccreations.net/hi-IN/content/${type}/${option}`,
                            "ja-JP": `https://mccreations.net/ja-JP/content/${type}/${option}`,
                            "ko-KR": `https://mccreations.net/ko-KR/content/${type}/${option}`,
                            "zh-TW": `https://mccreations.net/zh-TW/content/${type}/${option}`,
                            "en-US": `https://mccreations.net/en-US/content/${type}/${option}`,
                        }
                    }
                })
            }
        }
    // }

    return sitemap
}