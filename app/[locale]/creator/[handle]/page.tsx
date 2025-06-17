import { getCreator } from "@/app/api/community"
import Menu from "@/components/Menu/Navbar"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"
import styles from './CreatorPage.module.css'
import { CollectionNames, ContentTypes, IUser } from "@/app/api/types";
import { Metadata, ResolvingMetadata } from "next"
import { getTranslations } from "next-intl/server"
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, ExternalLink, MapPin, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { searchContent } from "@/app/api/content";
import Grid from "@/components/Creations/Grid";
import SubscribeButton from "@/components/ui/client_buttons/SubscribeButton";
import { Button } from "@/components/ui/button";
import { Link } from "@/app/api/navigation";
import { EditAbout, EditCustomCss, EditProfileImages, EditSocialLinks } from "./creatorEdit";
import dompurify from "isomorphic-dompurify";

interface CreatorPageProps {
    params: { handle: string }
}

export async function generateMetadata({ params }: CreatorPageProps): Promise<Metadata> {
    try {
        const creator = await getCreator(params.handle)

        if (!creator) {
        return {
            title: "Creator Not Found",
            description: "The requested creator could not be found.",
        }
        }

        return {
        title: `${creator.username} - Minecraft Creator`,
        description: `Check out ${creator.username}'s Minecraft maps, datapacks, and resource packs. Browse their collection and download their creations.`,
        alternates: {
            canonical: `/creator/${params.handle}`,
        },
        openGraph: {
            title: `${creator.username} - Minecraft Creator`,
            description: `Check out ${creator.username}'s Minecraft maps, datapacks, and resource packs. Browse their collection and download their creations.`,
            url: `/creator/${params.handle}`,
            type: "profile",
            images: creator.iconURL ? [{ url: creator.iconURL, width: 200, height: 200 }] : undefined,
        },
        }
    } catch (error) {
        console.error("Error generating metadata:", error)
        return {
        title: "Minecraft Map Creator",
        description: "View this creator's Minecraft maps and other creations.",
        }
    }
}

export default async function CreatorPage({ params }: CreatorPageProps) {
    const handle = params.handle

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-16">
            <Suspense fallback={<CreatorProfileSkeleton />}>
                <CreatorProfile handle={handle} />
            </Suspense>
        </div>
    )
}

function CreatorProfileSkeleton() {
    return (
        <div className="animate-pulse">
        <div className="relative w-full h-48 bg-gray-200 rounded-lg mb-16"></div>
        <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
            <div className="bg-card rounded-lg shadow p-6 space-y-6">
                <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gray-200 mb-4"></div>
                <div className="h-7 w-40 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 w-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 w-full bg-gray-200 rounded mb-4"></div>
                <div className="flex space-x-2 mb-4">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
                </div>
                <div className="space-y-4">
                <div className="h-5 w-full bg-gray-200 rounded"></div>
                <div className="h-5 w-full bg-gray-200 rounded"></div>
                <div className="h-5 w-full bg-gray-200 rounded"></div>
                </div>
            </div>
            </div>
            <div className="md:w-2/3">
            <div className="h-10 w-full bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
                ))}
            </div>
            </div>
        </div>
        </div>
    )
}

async function CreatorProfile({ handle }: { handle: string }) {
    try {
        const creator = await getCreator(handle)

        // if (!creator) {
        //     notFound()
        // }

        return (
        <>
            <style>
                {creator.customCSS && creator.customCSS.length > 0 ? dompurify.sanitize(creator.customCSS) : ""}
            </style>
            <div className="relative">
            {creator.bannerURL ? (
                <div className="relative w-full h-48 overflow-hidden mb-16 border-white/15 border-2">
                    <Image
                        src={creator.bannerURL || "/placeholder.svg"}
                        alt={`${creator.username}'s banner`}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            ) : (
                <div className="relative w-full h-48 bg-gradient-to-r from-blue-800 to-blue-600 mb-16"></div>
            )}
            <EditProfileImages params={{handle}} />

            <div className="absolute left-8 bottom-0 transform translate-y-1/2">
                <Avatar className="w-24 h-24 border-4 border-white">
                <AvatarImage
                    src={creator.iconURL || `https://api.dicebear.com/6.x/initials/svg?seed=${creator.username}`}
                    alt={creator.username}
                />
                <AvatarFallback>{(creator.username ?? "Unknown").charAt(0)}</AvatarFallback>
                </Avatar>
            </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
                <div className="bg-card relative card-shadow border-black border-2 p-6 space-y-6">
                <div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">{creator.username}</h1>
                            <p className="text-muted-foreground">@{creator.handle}</p>
                        </div>
                        <SubscribeButton handle={creator.handle} />
                    </div>

                </div>

                <div className="space-y-4">
                    <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{creator.followers?.length || 0} followers</span>
                    </div>
                </div>

                {creator.about && (
                    <div>
                    <h2 className="font-semibold mb-2">About</h2>
                    <p className="text-sm whitespace-pre-line" dangerouslySetInnerHTML={{__html: dompurify.sanitize(creator.about)}}></p>
                    <EditAbout params={{handle}} />
                    </div>
                )}
                {!creator.about && (
                    <EditAbout params={{handle}} />
                )}

                {creator.socialLinks && creator.socialLinks.length > 0 && (
                <div className="mt-4">
                    {creator.socialLinks?.map((link: {link: string, name: string}) => (
                        <Link href={link.link} target="_blank" rel="noopener noreferrer" key={link.link}>
                            <Button variant="ghost" className="w-full justify-start">
                                <Suspense fallback={<Image src="/favicon.ico" alt="favicon" width={20} height={20} />}>
                                    <img src={`https://geticon.io/img?url=https://${link.link.split("/")[2]}`} alt={link.name} width={20} height={20}/>
                                </Suspense>
                                <span>{link.name}</span>
                                <ExternalLink className="h-4 w-4 ml-auto" />
                            </Button>
                        </Link>
                    ))}
                    <EditSocialLinks params={{handle}} />
                </div>
                )}
                {!creator.socialLinks || creator.socialLinks.length === 0 && (
                    <EditSocialLinks params={{handle}} />
                )}
                <EditCustomCss params={{handle}} />
                </div>
            </div>

            <div className="md:w-2/3">
                <Tabs defaultValue="maps">
                    <TabsList className="mb-6">
                        <TabsTrigger value="maps">Maps</TabsTrigger>
                        <TabsTrigger value="datapacks">Datapacks</TabsTrigger>
                        <TabsTrigger value="resourcepacks">Resource Packs</TabsTrigger>
                    </TabsList>

                    <TabsContent value="maps">
                        <Suspense fallback={<CreatorContentSkeleton />}>
                        <CreatorMaps handle={handle} />
                        </Suspense>
                    </TabsContent>

                    <TabsContent value="datapacks">
                        <Suspense fallback={<CreatorContentSkeleton />}>
                        <CreatorDatapacks handle={handle} />
                        </Suspense>
                    </TabsContent>

                    <TabsContent value="resourcepacks">
                        <Suspense fallback={<CreatorContentSkeleton />}>
                        <CreatorResourcepacks handle={handle} />
                        </Suspense>
                    </TabsContent>
                </Tabs>
            </div>
            </div>
        </>
        )
    } catch (error) {
        console.error("Error loading creator profile:", error)
        notFound()
    }
}

function CreatorContentSkeleton() {
return (
    <div className="animate-pulse">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-gray-200 h-64"></div>
        ))}
    </div>
    </div>
)
}

async function CreatorMaps({ handle }: { handle: string }) {
    const maps = (await searchContent({creators: [handle], contentType: CollectionNames.Maps, limit: 10, page: 0}, false)).documents

    if (maps.length === 0) {
        return (
        <div className="text-center py-12 bg-muted">
            <p>This creator hasn't published any maps yet.</p>
        </div>
        )
    }

    return <Grid content={maps} />
}

async function CreatorDatapacks({ handle }: { handle: string }) {
    const datapacks = (await searchContent({creators: [handle], contentType: CollectionNames.Datapacks, limit: 10, page: 0}, false)).documents

    if (datapacks.length === 0) {
        return (
        <div className="text-center py-12 bg-muted">
            <p>This creator hasn't published any data packs yet.</p>
        </div>
        )
    }

    return <Grid content={datapacks} />
}

async function CreatorResourcepacks({ handle }: { handle: string }) {
    const resourcepacks = (await searchContent({creators: [handle], contentType: CollectionNames.Resourcepacks, limit: 10, page: 0}, false)).documents

    if (resourcepacks.length === 0) {
        return (
        <div className="text-center py-12 bg-muted">
            <p>This creator hasn't published any resource packs yet.</p>
        </div>
        )
    }

    return <Grid content={resourcepacks} />
}