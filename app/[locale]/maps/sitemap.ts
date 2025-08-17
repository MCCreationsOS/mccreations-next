import { MetadataRoute } from "next";
import { searchContent } from "@/app/api/content";
import { CollectionNames, IContentDoc, SortOptions } from "@/app/api/types";

// export async function generateSitemaps() {
//     return [{id: 0}]
// }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    let content = await searchContent({contentType: CollectionNames.Maps, status: 2, sort: SortOptions.Newest, limit: 50000}, false)
    return content.documents.map((doc: IContentDoc) => {
        // console.log(`Generating sitemap for ${doc.slug}`)
        return {
            url: `https://mccreations.net/en-US/maps/${doc.slug}`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'weekly',
            alternates: {
                languages: {
                    "en": `https://mccreations.net/en-US/maps/${doc.slug}`,
                    "en-US": `https://mccreations.net/en-US/maps/${doc.slug}`,
                    "zh-CN": `https://mccreations.net/zh-CN/maps/${doc.slug}`,
                    "ru-RU": `https://mccreations.net/ru-RU/maps/${doc.slug}`,
                    "nl-NL": `https://mccreations.net/nl-NL/maps/${doc.slug}`,
                    "fr-FR": `https://mccreations.net/fr-FR/maps/${doc.slug}`,
                    "hi-IN": `https://mccreations.net/hi-IN/maps/${doc.slug}`,
                    "ja-JP": `https://mccreations.net/ja-JP/maps/${doc.slug}`,
                    "ko-KR": `https://mccreations.net/ko-KR/maps/${doc.slug}`,
                    "zh-TW": `https://mccreations.net/zh-TW/maps/${doc.slug}`,
                }
            }
        }
    })
    
}