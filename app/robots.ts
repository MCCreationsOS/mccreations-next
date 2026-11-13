import { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "./sitemapUtils";

/** Private or per-user pages. Every page lives under a locale prefix, so each path is blocked for each locale. */
const PRIVATE_PATHS = ["/auth/", "/dashboard/", "/settings/", "/edit/", "/reset_password/", "/signin/reset"]

export default function robots(): MetadataRoute.Robots {
    const disallow = [
        ...PRIVATE_PATHS,
        ...routing.locales.flatMap((locale) => PRIVATE_PATHS.map((path) => `/${locale}${path}`)),
    ]
    return {
        rules: { userAgent: "*", allow: "/", disallow },
        sitemap: [
            `${SITE_URL}/sitemap.xml`,
            `${SITE_URL}/${routing.defaultLocale}/maps/sitemap.xml`,
            `${SITE_URL}/${routing.defaultLocale}/datapacks/sitemap.xml`,
            `${SITE_URL}/${routing.defaultLocale}/resourcepacks/sitemap.xml`,
            `${SITE_URL}/${routing.defaultLocale}/content/sitemap.xml`,
        ],
    }
}
