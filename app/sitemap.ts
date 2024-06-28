import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://next.mccreations.net',
            changeFrequency: 'weekly',
            lastModified: new Date()
        },
        {
            url: 'https://next.mccreations.net/signin',
            lastModified: new Date()
        },
        {
            url: 'https://next.mccreations.net/signup',
            lastModified: new Date()
        },
        {
            url: 'https://next.mccreations.net/maps',
            changeFrequency: 'weekly',
            lastModified: new Date()
        },
        {
            url: 'https://next.mccreations.net/datapacks',
            changeFrequency: 'weekly',
            lastModified: new Date()
        },
        {
            url: 'https://next.mccreations.net/resourcepacks',
            changeFrequency: 'weekly',
            lastModified: new Date()
        }
    ]
}