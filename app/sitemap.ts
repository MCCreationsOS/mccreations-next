import { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localizedAlternates, SITE_URL } from "./sitemapUtils";

const PAGES: { path: string, changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", changeFrequency: "daily" },
    { path: "/maps", changeFrequency: "daily" },
    { path: "/datapacks", changeFrequency: "daily" },
    { path: "/resourcepacks", changeFrequency: "daily" },
    { path: "/signin" },
    { path: "/signup" },
]

/** Top-level pages. Creations are listed in the per-type sitemaps referenced from robots.txt. */
export default function sitemap(): MetadataRoute.Sitemap {
    return PAGES.map((page) => ({
        url: `${SITE_URL}/${routing.defaultLocale}${page.path === "/" ? "/" : page.path}`,
        changeFrequency: page.changeFrequency,
        alternates: localizedAlternates(page.path === "/" ? "/" : page.path),
    }))
}
