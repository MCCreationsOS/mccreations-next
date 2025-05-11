'use client'

import { toast } from "sonner"
import { CollectionNames, IContentDoc } from "@/app/api/types";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { convertToType, deleteContent } from "@/app/api/content";
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
import { ImageIcon, Edit, Trash } from "lucide-react";

export default function Dashboard({collectionName}: {collectionName: CollectionNames}) {
    const {user, isLoading} = useUser(true)
    const {token} = useToken()
    const page = parseInt(useSearchParams().get("page") ?? "0")
    const {creations, count} = useCreations({contentType: collectionName, status: 0, limit: 20, page: page})
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

    if(!user) {
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
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {creations && creations.map((creation: IContentDoc, idx) => (
                        <TableRow key={creation._id}>
                            <TableCell className="max-w-xl">
                                <div className="flex flex-row items-center gap-4">
                                    <Image src={creation.images[0]} width={150} height={100} alt={`The logo for ${creation.title}`}/>
                                    <div className="flex flex-col">
                                        <Link href={`/edit/${collectionName}/${creation.slug}`}><h2 className="text-md font-bold">{creation.title}</h2></Link>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{creation.shortDescription}</p>
                                        <div className="flex flex-row items-center gap-2 mt-2">
                                            <Link href={`/edit/${collectionName}/${creation.slug}`}><Button size="icon" variant="secondary"><Edit /></Button></Link>
                                            <Link href={`/${collectionName}/${creation.slug}`}><Button size="icon" variant="secondary"><ImageIcon /></Button></Link>
                                            <Button onClick={() => handleDelete(creation.slug)} size="icon" variant="secondary"><Trash /></Button>
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{creation.status}</TableCell>
                            <TableCell>{new Date(creation.createdDate)}</TableCell>
                            <TableCell>{new Date(creation.updatedDate)}</TableCell>
                            <TableCell>{creation.downloads}</TableCell>
                            <TableCell>{(creation.rating * 5).toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
            </Table>
            <PageNavigator page={page} pages={Math.ceil(count / 20)} />
        </>
    )
}