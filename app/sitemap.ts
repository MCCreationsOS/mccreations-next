import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://mccreations.net/en-US/',
            changeFrequency: 'weekly',
            lastModified: new Date(),
            alternates: {
                languages: {
                    "zh-CN": 'https://mccreations.net/zh-CN/',
                    "ru-RU": 'https://mccreations.net/ru-RU/',
                }
            }
        },
        {
            url: 'https://mccreations.net/en-US/signin',
            lastModified: new Date(),
            alternates: {
                languages: {
                    "zh-CN": 'https://mccreations.net/zh-CN/signin',
                    "ru-RU": 'https://mccreations.net/ru-RU/signin',
                }
            }
        },
        {
            url: 'https://mccreations.net/en-US/signup',
            lastModified: new Date(),
            alternates: {
                languages: {
                    "zh-CN": 'https://mccreations.net/zh-CN/signup',
                    "ru-RU": 'https://mccreations.net/ru-RU/signup',
                }
            }
        },
        {
            url: 'https://mccreations.net/en-US/maps',
            changeFrequency: 'weekly',
            lastModified: new Date(),
            alternates: {
                languages: {
                    "zh-CN": 'https://mccreations.net/zh-CN/maps',
                    "ru-RU": 'https://mccreations.net/ru-RU/maps',
                }
            }
        },
        {
            url: 'https://mccreations.net/en-US/datapacks',
            changeFrequency: 'weekly',
            lastModified: new Date(),
            alternates: {
                languages: {
                    "zh-CN": 'https://mccreations.net/zh-CN/datapacks',
                    "ru-RU": 'https://mccreations.net/ru-RU/datapacks',
                }
            }
        },
        {
            url: 'https://mccreations.net/en-US/resourcepacks',
            changeFrequency: 'weekly',
            lastModified: new Date(),
            alternates: {
                languages: {
                    "zh-CN": 'https://mccreations.net/zh-CN/resourcepacks',
                    "ru-RU": 'https://mccreations.net/ru-RU/resourcepacks',
                }
            }
        }
    ]
}