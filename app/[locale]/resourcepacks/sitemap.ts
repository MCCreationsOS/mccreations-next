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
            lastModified: new Date((doc.updatedDate) ? doc.updatedDate! * 1000 : doc.createdDate * 1000).toISOString(),
            changeFrequency: 'weekly',
            alternates: {
                languages: {
                    "en": `https://mccreations.net/en-US/resourcepacks/${doc.slug}`,
                    "en-US": `https://mccreations.net/en-US/resourcepacks/${doc.slug}`,
                    "zh-CN": `https://mccreations.net/zh-CN/resourcepacks/${doc.slug}`,
                    "ru-RU": `https://mccreations.net/ru-RU/resourcepacks/${doc.slug}`,
                }
            }
        }
    })
    
}