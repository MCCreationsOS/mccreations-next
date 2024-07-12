import { MetadataRoute } from "next";
import { fetchContent } from "../api/content";
import { ContentTypes, IContentDoc, SortOptions } from "../../api/types";

// export async function generateSitemaps() {
//     return [{id: 0}]
// }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    let content = await fetchContent({contentType: ContentTypes.Maps, status: 2, sort: SortOptions.Newest, limit: 50000}, false)
    return content.documents.map((doc: IContentDoc) => {
        // console.log(`Generating sitemap for ${doc.slug}`)
        return {
            url: `https://next.mccreations.net/maps/${doc.slug}`,
            lastModified: new Date((doc.updatedDate) ? doc.updatedDate! * 1000 : doc.createdDate * 1000).toISOString(),
            changeFrequency: 'weekly'
        }
    })
    
}