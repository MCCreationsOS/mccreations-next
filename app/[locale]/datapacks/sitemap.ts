import { MetadataRoute } from "next";
import { CollectionNames } from "@/app/api/types";
import { creationSitemap } from "@/app/sitemapUtils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    return creationSitemap(CollectionNames.Datapacks, "datapacks")
}
