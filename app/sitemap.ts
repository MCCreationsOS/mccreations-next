import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://mccreations.net',
            changeFrequency: 'weekly',
            lastModified: new Date()
        },
        {
            url: 'https://mccreations.net/signin',
            lastModified: new Date()
        },
        {
            url: 'https://mccreations.net/signup',
            lastModified: new Date()
        },
        {
            url: 'https://mccreations.net/maps',
            changeFrequency: 'weekly',
            lastModified: new Date()
        },
        {
            url: 'https://mccreations.net/datapacks',
            changeFrequency: 'weekly',
            lastModified: new Date()
        },
        {
            url: 'https://mccreations.net/resourcepacks',
            changeFrequency: 'weekly',
            lastModified: new Date()
        }
    ]
}