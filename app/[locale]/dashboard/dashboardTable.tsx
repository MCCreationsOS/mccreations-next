'use client'

import { toast } from "sonner"
import { CollectionNames, IContentDoc, SortOptions, UserTypes } from "@/app/api/types";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { approveContent, convertToType, deleteContent } from "@/app/api/content";
import { useTranslations } from 'next-intl';
import { useTokenOrKey, useUser } from "@/app/api/hooks/users";
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
import { formatRating } from "@/app/api/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function DashboardTable({ collectionName }: { collectionName: CollectionNames }) {
    const { user, isLoading } = useUser(true)
    // People who uploaded without an account manage their draft through the creation key
    const { token } = useTokenOrKey()
    const page = parseInt(useSearchParams().get("page") ?? "0")
    const { creations, count, isLoading: creationsLoading, refresh } = useCreations({ contentType: collectionName, status: 0, limit: 20, page: page, sort: SortOptions.Newest })
    const contentType = convertToType(collectionName);
    const t = useTranslations()
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)
    const [bulkDeleting, setBulkDeleting] = useState(false)

    useEffect(() => {
        setSelectedIds(new Set())
    }, [page])

    if (isLoading || creationsLoading) {
        return <div className="centered_content">{t("Pages.Dashboard.loading")}</div>
    }

    if (!user && !token) {
        return (
            <div className="centered_content flex flex-col gap-2 items-center">
                <p>{t("Pages.Dashboard.sign_in_prompt")}</p>
                <Button asChild><Link href="/signin?redirect=dashboard">{t("Pages.Dashboard.sign_in")}</Link></Button>
            </div>
        )
    }

    const creationIds = creations?.map((creation) => creation._id) ?? []
    const allSelected = creationIds.length > 0 && creationIds.every((id) => selectedIds.has(id))
    const someSelected = creationIds.some((id) => selectedIds.has(id))
    const selectedCount = selectedIds.size

    const toggleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(new Set(creationIds))
        } else {
            setSelectedIds(new Set())
        }
    }

    const toggleSelect = (id: string, checked: boolean) => {
        setSelectedIds((prev) => {
            const next = new Set(prev)
            if (checked) {
                next.add(id)
            } else {
                next.delete(id)
            }
            return next
        })
    }

    const handleDelete = async (creation: IContentDoc) => {
        if (deletingId !== creation._id) {
            setDeletingId(creation._id)
            toast(t("Pages.Dashboard.delete_creation"))
            return
        }

        const success = await deleteContent(creation.slug, token, collectionName)
        setDeletingId(null)
        if (success) {
            toast.success(t("Pages.Dashboard.deleted"))
            setSelectedIds((prev) => {
                const next = new Set(prev)
                next.delete(creation._id)
                return next
            })
            refresh()
        } else {
            toast.error(t("Pages.Dashboard.delete_failed"))
        }
    }

    const handleBulkDelete = async () => {
        if (selectedCount === 0) return

        setBulkDeleting(true)
        const ids = Array.from(selectedIds)
        const results = await Promise.all(ids.map((id) => deleteContent(creations?.find((creation) => creation._id === id)?.slug ?? "", token, collectionName)))
        const deleted = results.filter(Boolean).length
        setBulkDeleting(false)
        setBulkConfirmOpen(false)

        if (deleted === ids.length) {
            toast.success(t("Pages.Dashboard.bulk_deleted", { count: deleted }))
            setSelectedIds(new Set())
            refresh()
        } else if (deleted > 0) {
            toast.error(t("Pages.Dashboard.bulk_delete_partial", { deleted, total: ids.length }))
            setSelectedIds(new Set())
            refresh()
        } else {
            toast.error(t("Pages.Dashboard.bulk_delete_failed"))
        }
    }

    const handleApprove = async (creation: IContentDoc) => {
        if (await approveContent(creation.slug, collectionName, token)) {
            toast.success(t("Pages.Dashboard.approved"))
            refresh()
        } else {
            toast.error(t("Pages.Dashboard.approve_failed"))
        }
    }

    return (
        <>
        {selectedCount > 0 && (
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => setBulkConfirmOpen(true)}
                    >
                        <Trash />
                        {t("Pages.Dashboard.delete_selected", { count: selectedCount })}
                    </Button>
                )}
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-10">
                            <Checkbox
                                checked={allSelected ? true : someSelected ? "indeterminate" : false}
                                onCheckedChange={(checked) => toggleSelectAll(checked === true)}
                                aria-label={t("Pages.Dashboard.Files.select_all")}
                            />
                        </TableHead>
                        <TableHead>{t('Pages.Dashboard.info')}</TableHead>
                        <TableHead>{t('Pages.Dashboard.status')}</TableHead>
                        <TableHead>{t('Pages.Dashboard.created_date')}</TableHead>
                        <TableHead>{t('Pages.Dashboard.updated_date')}</TableHead>
                        <TableHead>{t('Pages.Dashboard.downloads')}</TableHead>
                        <TableHead>{t('Pages.Dashboard.rating')}</TableHead>
                        {user?.type === UserTypes.Admin && <TableHead>{t('Pages.Dashboard.actions')}</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {creations.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={user?.type === UserTypes.Admin ? 8 : 7} className="text-center text-muted-foreground">{t('Pages.Dashboard.empty')}</TableCell>
                        </TableRow>
                    )}
                    {creations && creations.map((creation: IContentDoc, idx) => (
                        <TableRow key={creation._id}>
                            <TableCell>
                                <Checkbox
                                    checked={selectedIds.has(creation._id)}
                                    onCheckedChange={(checked) => toggleSelect(creation._id, checked === true)}
                                    aria-label={t("Pages.Dashboard.Files.select_file")}
                                />
                            </TableCell>
                            <TableCell className="max-w-xl">
                                <div className="flex flex-row items-center gap-4">
                                    <Suspense fallback={<div className="w-16 h-16 bg-gray-200 rounded-md"></div>}>
                                        <Image className="aspect-video object-cover" src={creation.images && creation.images.length > 0 ? creation.images[0] : '/defaultBanner.png'} width={150} height={100} alt={t('Pages.Dashboard.logo_alt', {title: creation.title})} />
                                    </Suspense>
                                    <div className="flex flex-col">
                                        <Link href={`/edit/${collectionName.toLowerCase()}/${creation.slug}`}><h2 className="text-md font-bold">{creation.title}</h2></Link>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{creation.shortDescription}</p>
                                        <div className="flex flex-row items-center gap-2 mt-2">
                                            <Button asChild size="icon" variant="secondary"><Link href={`/edit/${collectionName.toLowerCase()}/${creation.slug}`} title={t('Pages.Dashboard.edit')}><Edit /><span className="sr-only">{t('Pages.Dashboard.edit')}</span></Link></Button>
                                            <Button asChild size="icon" variant="secondary"><Link href={`/${collectionName.toLowerCase()}/${creation.slug}`} title={t('Pages.Dashboard.view')}><ImageIcon /><span className="sr-only">{t('Pages.Dashboard.view')}</span></Link></Button>
                                            <Button type="button" onClick={() => handleDelete(creation)} size="icon" title={t('Pages.Dashboard.delete')} variant={deletingId === creation._id ? "destructive" : "outline"}><Trash /><span className="sr-only">{t('Pages.Dashboard.delete')}</span></Button>
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{t(`Pages.Dashboard.Status.${creation.status}`)}</TableCell>
                            <TableCell>{creation.createdDate < 10000000000 ? new Date(creation.createdDate * 1000).toLocaleDateString() : new Date(creation.createdDate).toLocaleDateString()}</TableCell>
                            <TableCell>{creation.updatedDate ? (creation.updatedDate < 10000000000 ? new Date(creation.updatedDate * 1000).toLocaleDateString() : new Date(creation.updatedDate).toLocaleDateString()) : ''}</TableCell>
                            <TableCell>{creation.downloads}</TableCell>
                            <TableCell>{formatRating(creation.rating)}</TableCell>
                            {user?.type === UserTypes.Admin && (
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="secondary"><MoreHorizontal /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onSelect={() => handleApprove(creation)}>
                                                {t('Pages.Dashboard.approve')}
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

            <Dialog open={bulkConfirmOpen} onOpenChange={(open) => !bulkDeleting && setBulkConfirmOpen(open)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("Pages.Dashboard.bulk_delete_title")}</DialogTitle>
                        <DialogDescription>
                            {t("Pages.Dashboard.bulk_delete_description", { count: selectedCount })}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={bulkDeleting}
                            onClick={() => setBulkConfirmOpen(false)}
                        >
                            {t("Pages.Dashboard.Files.cancel")}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            disabled={bulkDeleting}
                            onClick={handleBulkDelete}
                        >
                            {bulkDeleting
                                ? t("Pages.Dashboard.bulk_deleting")
                                : t("Pages.Dashboard.bulk_delete_confirm")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}