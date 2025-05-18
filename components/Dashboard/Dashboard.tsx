'use client'

import { toast } from "sonner"
import { CollectionNames, IContentDoc, SortOptions, UserTypes } from "@/app/api/types";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { approveContent, convertToType, deleteContent } from "@/app/api/content";
import {useTranslations} from 'next-intl';
import { useToken, useUser } from "@/app/api/hooks/users";
import { useCreations } from "@/app/api/hooks/creations";
import PageNavigator from "../Creations/Search/Navigator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import Image from "next/image";
import { Link } from "@/app/api/navigation";
import { Button } from "../ui/button";
import { ImageIcon, Edit, Trash, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useIsClient } from "usehooks-ts";

export default function Dashboard({collectionName}: {collectionName: CollectionNames}) {
    const client = useIsClient()
    const {user, isLoading} = useUser(true)
    const {token} = useToken()
    const page = parseInt(useSearchParams().get("page") ?? "0")
    const {creations, count} = useCreations({contentType: collectionName, status: 0, limit: 20, page: page, sort: SortOptions.Newest})
    const contentType = convertToType(collectionName);
    const [deleting, setDeleting] = useState(false)
    const t = useTranslations()
    const router = useRouter()

    const handleDelete = (slug: string) => {
        if(!deleting) {
            setDeleting(true)
            toast(t('Dashboard.delete_content'))
            // PopupMessage.addMessage({type: PopupMessageType.Warning, message: t('Dashboard.delete_content'), time: 10000, endAction() {
            //     setDeleting(false)
            // },})
        } else {
            deleteContent(slug, token, collectionName)
            setDeleting(false)
        }
    }

    console.log(user)

    if(!user && client) {
        router.push("/signin?redirect=dashboard")
        return null
    }

    if(isLoading) {
        return <div className="centered_content">{t('Dashboard.loading')}</div>
    }
    

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t('Dashboard.info')}</TableHead>
                        <TableHead>{t('Dashboard.status')}</TableHead>
                        <TableHead>{t('Dashboard.created_date')}</TableHead>
                        <TableHead>{t('Dashboard.updated_date')}</TableHead>
                        <TableHead>{t('Dashboard.downloads')}</TableHead>
                        <TableHead>{t('Dashboard.rating')}</TableHead>
                        <TableHead>{t('Dashboard.comments')}</TableHead>
                        {user?.type === UserTypes.Admin && <TableHead>{t('Dashboard.actions')}</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {creations && creations.map((creation: IContentDoc, idx) => (
                        <TableRow key={creation._id}>
                            <TableCell className="max-w-xl">
                                <div className="flex flex-row items-center gap-4">
                                    <Suspense fallback={<div className="w-16 h-16 bg-gray-200 rounded-md"></div>}>
                                        <Image className="aspect-video object-cover" src={creation.images[0]} width={150} height={100} alt={`The logo for ${creation.title}`}/>
                                    </Suspense>
                                    <div className="flex flex-col">
                                        <Link href={`/edit/${collectionName.toLowerCase()}/${creation.slug}`}><h2 className="text-md font-bold">{creation.title}</h2></Link>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{creation.shortDescription}</p>
                                        <div className="flex flex-row items-center gap-2 mt-2">
                                            <Link href={`/edit/${collectionName.toLowerCase()}/${creation.slug}`}><Button size="icon" variant="secondary"><Edit /></Button></Link>
                                            <Link href={`/${collectionName.toLowerCase()}/${creation.slug}`}><Button size="icon" variant="secondary"><ImageIcon /></Button></Link>
                                            <Button onClick={() => handleDelete(creation.slug)} size="icon" variant="destructive"><Trash /></Button>
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{creation.status}</TableCell>
                            <TableCell>{creation.createdDate < 10000000000 ? new Date(creation.createdDate * 1000).toLocaleDateString() : new Date(creation.createdDate).toLocaleDateString()}</TableCell>
                            <TableCell>{creation.updatedDate ? (creation.updatedDate < 10000000000 ? new Date(creation.updatedDate * 1000).toLocaleDateString() : new Date(creation.updatedDate).toLocaleDateString()) : ''}</TableCell>
                            <TableCell>{creation.downloads}</TableCell>
                            <TableCell>{(creation.rating * 5).toFixed(2)}</TableCell>
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