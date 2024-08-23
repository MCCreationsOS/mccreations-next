import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://mccreations.net/en-US/',
            changeFrequency: 'weekly',
            lastModified: new Date(),
            alternates: {
                languages: {
                    "zh-CN": 'https://mccreations.net/zh_CN/',
                }
            }
        },
        {
            url: 'https://mccreations.net/en-US/signin',
            lastModified: new Date(),
            alternates: {
                languages: {
                    "zh-CN": 'https://mccreations.net/zh_CN/signin',
                }
            }
        },
        {
            url: 'https://mccreations.net/en-US/signup',
            lastModified: new Date(),
            alternates: {
                languages: {
                    "zh-CN": 'https://mccreations.net/zh_CN/signup',
                }
            }
        },
        {
            url: 'https://mccreations.net/en-US/maps',
            changeFrequency: 'weekly',
            lastModified: new Date(),
            alternates: {
                languages: {
                    "zh-CN": 'https://mccreations.net/zh_CN/maps',
                }
            }
        },
        {
            url: 'https://mccreations.net/en-US/datapacks',
            changeFrequency: 'weekly',
            lastModified: new Date(),
            alternates: {
                languages: {
                    "zh-CN": 'https://mccreations.net/zh_CN/datapacks',
                }
            }
        },
        {
            url: 'https://mccreations.net/en-US/resourcepacks',
            changeFrequency: 'weekly',
            lastModified: new Date(),
            alternates: {
                languages: {
                    "zh-CN": 'https://mccreations.net/zh_CN/resourcepacks',
                }
            }
        }
    ]
}