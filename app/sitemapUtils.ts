import { routing } from "@/i18n/routing"
import { searchContent } from "@/app/api/content"
import { CollectionNames, IContentDoc, SortOptions } from "@/app/api/types"
import { MetadataRoute } from "next"

export const SITE_URL = "https://mccreations.net"

/** hreflang alternates for a path (without the locale prefix) in every supported locale */
export function localizedAlternates(path: string) {
    return {
        languages: Object.fromEntries(routing.locales.map((locale) => [locale, `${SITE_URL}/${locale}${path}`]))
    }
}

/** Older creations store dates in seconds rather than milliseconds */
function toDate(value?: number) {
    if (!value) return undefined
    return new Date(value < 10000000000 ? value * 1000 : value)
}

const PAGE_SIZE = 100
const MAX_ENTRIES = 5000

/** Every approved creation of a type, newest first, as sitemap entries */
export async function creationSitemap(collection: CollectionNames, pathPrefix: string): Promise<MetadataRoute.Sitemap> {
    const entries: MetadataRoute.Sitemap = []
    for (let page = 0; entries.length < MAX_ENTRIES; page++) {
        const { documents } = await searchContent({ contentType: collection, status: 2, sort: SortOptions.Newest, limit: PAGE_SIZE, page }, false)
        documents.forEach((doc: IContentDoc) => {
            entries.push({
                url: `${SITE_URL}/${routing.defaultLocale}/${pathPrefix}/${doc.slug}`,
                lastModified: toDate(doc.updatedDate ?? doc.createdDate),
                changeFrequency: 'weekly',
                alternates: localizedAlternates(`/${pathPrefix}/${doc.slug}`)
            })
        })
        if (documents.length < PAGE_SIZE) break
    }
    return entries
}
