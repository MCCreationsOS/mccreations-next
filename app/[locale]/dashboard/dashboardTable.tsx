'use client'

import { toast } from "sonner"
import { CollectionNames, IContentDoc, SortOptions, UserTypes } from "@/app/api/types";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { approveContent, convertToType, deleteContent } from "@/app/api/content";
import { useTranslations } from 'next-intl';
import { useToken, useUser } from "@/app/api/hooks/users";
import { useCreations } from "@/app/api/hooks/creations";
import PageNavigator from "../../../components/Creations/Search/Navigator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "../../../components/ui/button";
import { ImageIcon, Edit, Trash, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { useIsClient } from "usehooks-ts";
import { formatRating } from "@/app/api/utils";

export default function dashboardTable({ collectionName }: { collectionName: CollectionNames }) {
    const client = useIsClient()
    const { user, isLoading } = useUser(true)
    const { token } = useToken()
    const page = parseInt(useSearchParams().get("page") ?? "0")
    const { creations, count } = useCreations({ contentType: collectionName, status: 0, limit: 20, page: page, sort: SortOptions.Newest })
    const contentType = convertToType(collectionName);
    const [deleting, setDeleting] = useState(false)
    const t = useTranslations()
    const router = useRouter()

    const handleDelete = (slug: string) => {
        if (!deleting) {
            setDeleting(true)
            toast(<span>{t('Pages.Dashboard.delete_creation')}</span>)
        } else {
            deleteContent(slug, token, collectionName)
            setDeleting(false)
        }
    }

    console.log(user)


    if (isLoading) {
        return <div className="centered_content">{t('Pages.Dashboard.loading')}</div>
    }

    // if(!user && client) {
    //     console.log(user)
    //     router.push("/signin?redirect=dashboard")
    //     return null
    // }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t('Pages.Dashboard.info')}</TableHead>
                        <TableHead>{t('Pages.Dashboard.status')}</TableHead>
                        <TableHead>{t('Pages.Dashboard.created_date')}</TableHead>
                        <TableHead>{t('Pages.Dashboard.updated_date')}</TableHead>
                        <TableHead>{t('Pages.Dashboard.downloads')}</TableHead>
                        <TableHead>{t('Pages.Dashboard.rating')}</TableHead>
                        <TableHead>{t('Pages.Dashboard.comments')}</TableHead>
                        {user?.type === UserTypes.Admin && <TableHead>{t('Pages.Dashboard.actions')}</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {creations && creations.map((creation: IContentDoc, idx) => (
                        <TableRow key={creation._id}>
                            <TableCell className="max-w-xl">
                                <div className="flex flex-row items-center gap-4">
                                    <Suspense fallback={<div className="w-16 h-16 bg-gray-200 rounded-md"></div>}>
                                        <Image className="aspect-video object-cover" src={creation.images[0]} width={150} height={100} alt={`The logo for ${creation.title}`} />
                                    </Suspense>
                                    <div className="flex flex-col">
                                        <Link href={`/edit/${collectionName.toLowerCase()}/${creation.slug}`}><h2 className="text-md font-bold">{creation.title}</h2></Link>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{creation.shortDescription}</p>
                                        <div className="flex flex-row items-center gap-2 mt-2">
                                            <Link href={`/edit/${collectionName.toLowerCase()}/${creation.slug}`}><Button size="icon" variant="secondary"><Edit /></Button><span className="sr-only">{t('Pages.Dashboard.edit')}</span></Link>
                                            <Link href={`/${collectionName.toLowerCase()}/${creation.slug}`}><Button size="icon" variant="secondary"><ImageIcon /></Button><span className="sr-only">{t('Pages.Dashboard.view')}</span></Link>
                                            <Button onClick={() => handleDelete(creation.slug)} size="icon" variant="destructive"><Trash /><span className="sr-only">{t('Pages.Dashboard.delete')}</span></Button>
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{creation.status}</TableCell>
                            <TableCell>{creation.createdDate < 10000000000 ? new Date(creation.createdDate * 1000).toLocaleDateString() : new Date(creation.createdDate).toLocaleDateString()}</TableCell>
                            <TableCell>{creation.updatedDate ? (creation.updatedDate < 10000000000 ? new Date(creation.updatedDate * 1000).toLocaleDateString() : new Date(creation.updatedDate).toLocaleDateString()) : ''}</TableCell>
                            <TableCell>{creation.downloads}</TableCell>
                            <TableCell>{formatRating(creation.rating)}</TableCell>
                            <TableCell>{creation.comments?.length ?? 0}</TableCell>
                            {user?.type === UserTypes.Admin && (
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="secondary"><MoreHorizontal /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem>
                                                <Button variant="dropdown" onClick={() => approveContent(creation.slug, collectionName, token)}>Approve</Button>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <PageNavigator page={page} pages={Math.ceil(count / 20)} />
        </>
    )
}