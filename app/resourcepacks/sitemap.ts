import { MetadataRoute } from "next";
import { fetchContent } from "../api/content";
import { ContentTypes, IContentDoc } from "../types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    let content = await fetchContent({contentType: ContentTypes.Resourcepacks, status: 2}, false)
    return content.documents.map((doc: IContentDoc) => {
        return {
            url: `https://next.mccreations.net/resourcepacks/${doc.slug}`,
            lastModified: doc.updatedDate,
            changeFrequency: 'weekly'
        }
    })
    
}