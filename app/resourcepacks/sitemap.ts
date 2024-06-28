import { MetadataRoute } from "next";
import { fetchContent } from "../api/content";
import { ContentTypes, IContentDoc, SortOptions } from "../types";

// export async function generateSitemaps() {
//     return [{id: 0}]
// }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    let content = await fetchContent({contentType: ContentTypes.Resourcepacks, status: 2, sort: SortOptions.Newest, limit: 50000}, false)
    return content.documents.map((doc: IContentDoc) => {
        return {
            url: `https://next.mccreations.net/resourcepacks/${doc.slug}`,
            lastModified: new Date(doc.updatedDate || doc.createdDate).toISOString(),
            changeFrequency: 'weekly'
        }
    })
    
}