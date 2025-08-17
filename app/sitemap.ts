import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://mccreations.net/en-US/',
            changeFrequency: 'weekly',
            lastModified: new Date(),
            alternates: {
                languages: {
                    "en-US": 'https://mccreations.net/en-US/',
                    "zh-CN": 'https://mccreations.net/zh-CN/',
                    "ru-RU": 'https://mccreations.net/ru-RU/',
                    "nl-NL": 'https://mccreations.net/nl-NL/',
                    "fr-FR": 'https://mccreations.net/fr-FR/',
                    "hi-IN": 'https://mccreations.net/hi-IN/',
                    "ja-JP": 'https://mccreations.net/ja-JP/',
                    "ko-KR": 'https://mccreations.net/ko-KR/',
                    "zh-TW": 'https://mccreations.net/zh-TW/',
                }
            }
        },
        {
            url: 'https://mccreations.net/en-US/signin',
            lastModified: new Date(),
            alternates: {
                languages: {
                    "en-US": 'https://mccreations.net/en-US/signin',
                    "zh-CN": 'https://mccreations.net/zh-CN/signin',
                    "ru-RU": 'https://mccreations.net/ru-RU/signin',
                    "nl-NL": 'https://mccreations.net/nl-NL/signin',
                    "fr-FR": 'https://mccreations.net/fr-FR/signin',
                    "hi-IN": 'https://mccreations.net/hi-IN/signin',
                    "ja-JP": 'https://mccreations.net/ja-JP/signin',
                    "ko-KR": 'https://mccreations.net/ko-KR/signin',
                    "zh-TW": 'https://mccreations.net/zh-TW/signin',
                }
            }
        },
        {
            url: 'https://mccreations.net/en-US/signup',
            lastModified: new Date(),
            alternates: {
                languages: {
                    "en-US": 'https://mccreations.net/en-US/signup',
                    "zh-CN": 'https://mccreations.net/zh-CN/signup',
                    "ru-RU": 'https://mccreations.net/ru-RU/signup',
                    "nl-NL": 'https://mccreations.net/nl-NL/signup',
                    "fr-FR": 'https://mccreations.net/fr-FR/signup',
                    "hi-IN": 'https://mccreations.net/hi-IN/signup',
                    "ja-JP": 'https://mccreations.net/ja-JP/signup',
                    "ko-KR": 'https://mccreations.net/ko-KR/signup',
                    "zh-TW": 'https://mccreations.net/zh-TW/signup',
                }
            }
        },
        {
            url: 'https://mccreations.net/en-US/maps',
            changeFrequency: 'weekly',
            lastModified: new Date(),
            alternates: {
                languages: {
                    "en-US": 'https://mccreations.net/en-US/maps',
                    "zh-CN": 'https://mccreations.net/zh-CN/maps',
                    "ru-RU": 'https://mccreations.net/ru-RU/maps',
                    "nl-NL": 'https://mccreations.net/nl-NL/maps',
                    "fr-FR": 'https://mccreations.net/fr-FR/maps',
                    "hi-IN": 'https://mccreations.net/hi-IN/maps',
                    "ja-JP": 'https://mccreations.net/ja-JP/maps',
                    "ko-KR": 'https://mccreations.net/ko-KR/maps',
                    "zh-TW": 'https://mccreations.net/zh-TW/maps',
                }
            }
        },
        {
            url: 'https://mccreations.net/en-US/datapacks',
            changeFrequency: 'weekly',
            lastModified: new Date(),
            alternates: {
                languages: {
                    "en-US": 'https://mccreations.net/en-US/datapacks',
                    "zh-CN": 'https://mccreations.net/zh-CN/datapacks',
                    "ru-RU": 'https://mccreations.net/ru-RU/datapacks',
                    "nl-NL": 'https://mccreations.net/nl-NL/datapacks',
                    "fr-FR": 'https://mccreations.net/fr-FR/datapacks',
                    "hi-IN": 'https://mccreations.net/hi-IN/datapacks',
                    "ja-JP": 'https://mccreations.net/ja-JP/datapacks',
                    "ko-KR": 'https://mccreations.net/ko-KR/datapacks',
                    "zh-TW": 'https://mccreations.net/zh-TW/datapacks',
                }
            }
        },
        {
            url: 'https://mccreations.net/en-US/resourcepacks',
            changeFrequency: 'weekly',
            lastModified: new Date(),
            alternates: {
                languages: {
                    "en-US": 'https://mccreations.net/en-US/resourcepacks',
                    "zh-CN": 'https://mccreations.net/zh-CN/resourcepacks',
                    "ru-RU": 'https://mccreations.net/ru-RU/resourcepacks',
                    "nl-NL": 'https://mccreations.net/nl-NL/resourcepacks',
                    "fr-FR": 'https://mccreations.net/fr-FR/resourcepacks',
                    "hi-IN": 'https://mccreations.net/hi-IN/resourcepacks',
                    "ja-JP": 'https://mccreations.net/ja-JP/resourcepacks',
                    "ko-KR": 'https://mccreations.net/ko-KR/resourcepacks',
                    "zh-TW": 'https://mccreations.net/zh-TW/resourcepacks',
                }
            }
        }
    ]
}