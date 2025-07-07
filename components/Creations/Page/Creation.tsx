"use client"

import { IContentDoc, CollectionNames, } from "@/app/api/types";
import Image from 'next/image'
import { Car, Download, EllipsisVertical } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { makeSentenceCase } from "@/app/api/utils";
import { convertToType, downloadCreation } from "@/app/api/content";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTags } from "@/app/api/hooks/creations";
import DOMPurify from "isomorphic-dompurify";
import CreatorCard from "@/components/Creator/CreatorCard";
import Rating from "@/components/Creations/Page/Rating";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import RecommendedCreations from "./RecommendedCreations";
import Comments from "./Comments";
import { getCookie, setCookie } from "@/app/setCookies";
import { postRating } from "@/app/api/community";
import { useCallback } from "react";
import DownloadButton from "@/components/ui/client_buttons/DownloadButton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import TranslationForm from "./CreationOptions";
import CreationOptions from "./CreationOptions";
import { Link } from "@/i18n/navigation";

export const dynamic = 'force-dynamic'

/**
 * The map component represents all the information displayed on a map page
 * @param map The map to display
 * @param privileged If the user is privileged to see the content
 */
export default function Creation({creation, collectionName}: {creation: IContentDoc, collectionName: CollectionNames}) {
    const t = useTranslations()
    const locale = useLocale();
    const contentType = convertToType(collectionName);
    const {tags} = useTags(contentType)

    let title = creation.title
    let description = creation.description
    let shortDescription = creation.shortDescription

    console.log(locale)
    
    if(creation.translations && creation.translations[locale] && creation.translations[locale].approved) {
        title = creation.translations[locale].title
        description = creation.translations[locale].description
        shortDescription = creation.translations[locale].shortDescription
    }

    let videoID = ""
    if(creation.videoUrl && creation.videoUrl.includes("?v=")) {
        videoID = creation.videoUrl.substring(creation.videoUrl.indexOf("?v=") + 3, (creation.videoUrl.lastIndexOf("&") > 0) ? creation.videoUrl.lastIndexOf("&") : creation.videoUrl.length)
    } else if(creation.videoUrl) {
        videoID = creation.videoUrl.substring(creation.videoUrl.lastIndexOf("/") + 1)
    }

    let jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: title,
        applicationCategory: "Game",
        operatingSystem: "Windows, macOS, Linux",
        description: shortDescription || description.substring(0, 160),
        datePublished: new Date(creation.createdDate).toISOString(),
        dateModified: new Date(creation.updatedDate ?? creation.createdDate).toISOString(),
        author: {
          "@type": "Person",
          name: creation.creators && creation.creators.length > 0 ? creation.creators[0].username : "Unknown",
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        image: creation.images && creation.images.length > 0 ? creation.images[0] : undefined,
        downloadUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/creations/${collectionName}/${creation.slug}/download`,
      }

      if(creation.rating > 0 && creation.ratings && creation.ratings.length > 0) {
        // @ts-ignore
        jsonLd.aggregateRating = {
                "@type": "AggregateRating",
                ratingValue: (creation.rating * 5).toFixed(1),
                ratingCount: creation.ratings.length,
                bestRating: "5",
                worstRating: "1",
        }
      }

    return (
        <div>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <div className="w-full max-h-96 relative">
                <div className="w-full max-h-96 object-cover object-center hidden md:block">
                    <Image className="w-full max-h-96 object-cover object-center opacity-20" width={1920} height={1080} src={creation.images[0]} alt={t('Components.Creations.Page.logo_alt', {title: title, type: t(creation.type, {count: 1})})}></Image>
                </div>
                <div className="w-full h-full object-cover object-center aspect-video z-2 mx-auto md:absolute md:top-5">
                    <Image className="max-w-xl w-full mx-auto object-cover object-center" width={1280} height={720} src={creation.images[0]} alt={t('Components.Creations.Page.logo_alt', {title: title, type: t(creation.type, {count: 1})})} priority></Image>
                </div>
                <div className="w-full h-8 object-cover object-center aspect-video z-2 hidden md:flex md:absolute md:bottom-[-15px] gap-1 justify-center">
                    {creation.files[0]?.minecraftVersion && <Badge className="text-md">{creation.files[0].minecraftVersion}</Badge>}
                        {
                            (creation.type === "map") ? <><Link href={`/${creation.type}s`}><Badge variant="secondary" className="text-md">{t(creation.type, {count: 1})}</Badge></Link></> : 
                                (creation.type === "datapack") ? <><Link href={`/${creation.type}s`}><Badge variant="secondary" className="text-md">{t('datapack', {count: 1})}</Badge></Link></> : 
                                <><Link href={`/${creation.type}s`}><Badge variant="secondary" className="text-md">{t('resourcepack', {count: 1})}</Badge></Link></>
                        }
                        {creation.tags && creation.tags.length > 0 && <>{creation.tags.slice(0, 6).map(tag => tag ? <Link href={`/${creation.type}s?includeTags=${tag}`}><Badge key={tag} variant="secondary" className="text-md">{t(`Components.Creations.Tags.${tag}`)}</Badge></Link> : <></>)}</>}
                </div>
            </div>
            <div className="max-w-4xl mx-auto mt-3 md:mt-10">
                <div className="flex flex-row gap-4 mb-2">
                    <h1 className="text-4xl font-extrabold flex-1">{title}</h1>
                    <div className="flex flex-row gap-2">
                        <DownloadButton slug={creation.slug} file={creation.files[0]} contentType={contentType} className="px-6 py-5"/>
                        <CreationOptions creation={creation} />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(description)}} className="lg:text-lg flex-1">

                    </div>
                    <div className="flex flex-col gap-4 max-w-sm h-fit justify-self-end">
                        <div className="bg-card border-gray-950 border-2 p-5 w-full flex-1/2">
                            <div className="flex flex-col gap-2">
                                {creation.creators.map(creator => <CreatorCard creator={creator} key={creator.username}/>)}
                            </div>
                            <hr className="my-2"></hr>
                            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                                <div>
                                    <Rating value={creation.rating} currentRating={creation.rating} ratings={creation.ratings} showCount={true} onRate={async (value) => {
                                        let cookie = await getCookie("RATED_" + creation._id)
                                        if(!cookie) {
                                            await postRating(value, creation);
                                            setCookie("RATED_" + creation._id, "true")
                                        }
                                    }}/>
                                </div>
                                <div className="flex flex-row">
                                    <span className="flex-1">{t('Components.Creations.Page.Sidebar.downloads')}</span>
                                    <span>{creation.downloads}</span>
                                </div>
                                <div className="flex flex-row">
                                    <span className="flex-1">{t('Components.Creations.Page.Sidebar.created_date')}</span>
                                    <span>{new Date(creation.createdDate).toLocaleDateString()}</span>
                                </div>
                                {creation.updatedDate && <div className="flex flex-row">
                                    <span className="flex-1">{t('Components.Creations.Page.Sidebar.updated_date')}</span>
                                    <span>{new Date(creation.updatedDate).toLocaleDateString()}</span>
                                </div>}
                            </div>
                            <hr className="my-2"></hr>
                        </div>
                    <RecommendedCreations creation={creation}/>
                    </div>
                </div>
                <div className="mt-5">
                    <Carousel plugins={[Autoplay({delay: 4000})]}>
                        <CarouselContent>
                            {creation.images.slice(1, creation.images.length).map(image => <CarouselItem key={image}>
                                <Image className="aspect-video object-cover object-center" width={1920} height={1080} src={image} alt={t('Components.Creations.Page.images_alt', {index: creation.images.indexOf(image) + 1, total: creation.images.length, title: title})}></Image>
                            </CarouselItem>) ?? <CarouselItem><div className="aspect-video object-cover object-center"></div></CarouselItem>}
                        </CarouselContent>
                        <CarouselNext/>
                        <CarouselPrevious/>
                    </Carousel>
                </div>
                <div>
                    <Comments creation={creation} collection={collectionName} />
                </div>
            </div>
        </div>
    )
}