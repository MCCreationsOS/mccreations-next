import { MetadataRoute } from "next";
import { fetchContent } from "../api/content";
import { ContentTypes, IContentDoc } from "../types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    let datapacks = await fetchContent({contentType: ContentTypes.Datapacks, status: 2}, false)
    return datapacks.documents.map((doc: IContentDoc) => {
        return {
            url: `https://next.mccreations.net/datapacks/${doc.slug}`,
            lastModified: doc.updatedDate,
            changeFrequency: 'weekly'
        }
    })
    
}