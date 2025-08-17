import { MetadataRoute } from "next";
import { searchContent } from "@/app/api/content";
import { CollectionNames, IContentDoc, SortOptions } from "@/app/api/types";

// export async function generateSitemaps() {
//     return [{id: 0}]
// }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    let content = await searchContent({contentType: CollectionNames.Resourcepacks, status: 2, sort: SortOptions.Newest, limit: 50000}, false)
    // content.documents = content.documents.filter((doc: IContentDoc) => doc.allowIndexing === false)
    return content.documents.map((doc: IContentDoc) => {
        return {
            url: `https://mccreations.net/en-US/resourcepacks/${doc.slug}`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'weekly',
            alternates: {
                languages: {
                    "en": `https://mccreations.net/en-US/resourcepacks/${doc.slug}`,
                    "en-US": `https://mccreations.net/en-US/resourcepacks/${doc.slug}`,
                    "zh-CN": `https://mccreations.net/zh-CN/resourcepacks/${doc.slug}`,
                    "ru-RU": `https://mccreations.net/ru-RU/resourcepacks/${doc.slug}`,
                    "nl-NL": `https://mccreations.net/nl-NL/resourcepacks/${doc.slug}`,
                    "fr-FR": `https://mccreations.net/fr-FR/resourcepacks/${doc.slug}`,
                    "hi-IN": `https://mccreations.net/hi-IN/resourcepacks/${doc.slug}`,
                    "ja-JP": `https://mccreations.net/ja-JP/resourcepacks/${doc.slug}`,
                    "ko-KR": `https://mccreations.net/ko-KR/resourcepacks/${doc.slug}`,
                    "zh-TW": `https://mccreations.net/zh-TW/resourcepacks/${doc.slug}`,
                }
            }
        }
    })
    
}