"use client"

import { deleteFile, getFileDownloadUrl, updateFile } from "@/app/api/files"
import { useFiles } from "@/app/api/hooks/files"
import { useToken, useUser } from "@/app/api/hooks/users"
import { IFileRecord, UserTypes } from "@/app/api/types"
import PageNavigator from "@/components/Creations/Search/Navigator"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Download, Edit, Trash } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, useState } from "react"
import { toast } from "sonner"

export default function FilesTable() {
    const t = useTranslations()
    const router = useRouter()
    const searchParams = useSearchParams()
    const page = parseInt(searchParams.get("page") ?? "0")
    const userFilter = searchParams.get("user") ?? ""
    const { user, isLoading: userLoading } = useUser(true)
    const { token } = useToken()
    const { files, total, isLoading, refresh } = useFiles({ limit: 20, page, user: userFilter || undefined })
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [editingFile, setEditingFile] = useState<IFileRecord | null>(null)
    const [filterInput, setFilterInput] = useState(userFilter)
    const [saving, setSaving] = useState(false)

    if (userLoading || isLoading) {
        return <div className="centered_content">{t("Pages.Dashboard.loading")}</div>
    }

    if (!user || user.type !== UserTypes.Admin) {
        router.push("/signin?redirect=dashboard/files")
        return null
    }

    const handleDelete = async (file: IFileRecord) => {
        if (deletingId !== file._id) {
            setDeletingId(file._id)
            toast(t("Pages.Dashboard.Files.delete_confirm"))
            return
        }

        const success = await deleteFile(file._id, token)
        setDeletingId(null)
        if (success) {
            toast.success(t("Pages.Dashboard.Files.deleted"))
            refresh()
        } else {
            toast.error(t("Pages.Dashboard.Files.delete_failed"))
        }
    }

    const handleFilter = (e: FormEvent) => {
        e.preventDefault()
        const params = new URLSearchParams(searchParams)
        params.set("page", "0")
        if (filterInput) {
            params.set("user", filterInput)
        } else {
            params.delete("user")
        }
        router.push(`?${params.toString()}`)
    }

    const handleSave = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!editingFile) return

        setSaving(true)
        const formData = new FormData(e.currentTarget)
        const updated = await updateFile(editingFile._id, {
            filename: formData.get("filename") as string,
            name: formData.get("name") as string,
            mimetype: formData.get("mimetype") as string,
            type: formData.get("type") as string,
        }, token)

        setSaving(false)
        if (updated) {
            toast.success(t("Pages.Dashboard.Files.saved"))
            setEditingFile(null)
            refresh()
        } else {
            toast.error(t("Pages.Dashboard.Files.save_failed"))
        }
    }

    const formatDate = (date?: number) => {
        if (!date) return "—"
        return date < 10000000000
            ? new Date(date * 1000).toLocaleDateString()
            : new Date(date).toLocaleDateString()
    }

    return (
        <>
            <form onSubmit={handleFilter} className="flex flex-row gap-2 mb-4">
                <Input
                    placeholder={t("Pages.Dashboard.Files.user_filter")}
                    value={filterInput}
                    onChange={(e) => setFilterInput(e.target.value)}
                    className="max-w-xs"
                />
                <Button type="submit" variant="secondary">{t("Pages.Dashboard.Files.filter")}</Button>
                {userFilter && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setFilterInput("")
                            router.push("?page=0")
                        }}
                    >
                        {t("Pages.Dashboard.Files.clear_filter")}
                    </Button>
                )}
            </form>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t("Pages.Dashboard.Files.name")}</TableHead>
                        <TableHead>{t("Pages.Dashboard.Files.filename")}</TableHead>
                        <TableHead>{t("Pages.Dashboard.Files.type")}</TableHead>
                        <TableHead>{t("Pages.Dashboard.Files.mimetype")}</TableHead>
                        <TableHead>{t("Pages.Dashboard.Files.user")}</TableHead>
                        <TableHead>{t("Pages.Dashboard.created_date")}</TableHead>
                        <TableHead>{t("Pages.Dashboard.actions")}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {files && files.length > 0 ? files.map((file) => (
                        <TableRow key={file._id}>
                            <TableCell className="font-medium max-w-[200px] truncate">{file.name}</TableCell>
                            <TableCell className="max-w-[200px] truncate text-muted-foreground">{file.filename}</TableCell>
                            <TableCell>{file.type}</TableCell>
                            <TableCell className="text-muted-foreground">{file.mimetype}</TableCell>
                            <TableCell>{file.user ?? "—"}</TableCell>
                            <TableCell>{formatDate(file.createdDate)}</TableCell>
                            <TableCell>
                                <div className="flex flex-row gap-1">
                                    <Button size="icon" variant="secondary" asChild>
                                        <a href={getFileDownloadUrl(file._id)} download={file.filename}>
                                            <Download />
                                            <span className="sr-only">{t("Pages.Dashboard.Files.download")}</span>
                                        </a>
                                    </Button>
                                    <Button size="icon" variant="secondary" onClick={() => setEditingFile(file)}>
                                        <Edit />
                                        <span className="sr-only">{t("Pages.Dashboard.edit")}</span>
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant={deletingId === file._id ? "destructive" : "outline"}
                                        onClick={() => handleDelete(file)}
                                    >
                                        <Trash />
                                        <span className="sr-only">{t("Pages.Dashboard.delete")}</span>
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                {t("Pages.Dashboard.Files.no_files")}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {total > 0 && <PageNavigator page={page} pages={Math.ceil(total / 20)} />}

            <Dialog open={!!editingFile} onOpenChange={(open) => !open && setEditingFile(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("Pages.Dashboard.Files.edit_title")}</DialogTitle>
                    </DialogHeader>
                    {editingFile && (
                        <form onSubmit={handleSave} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="name">{t("Pages.Dashboard.Files.name")}</Label>
                                <Input id="name" name="name" defaultValue={editingFile.name} required />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="filename">{t("Pages.Dashboard.Files.filename")}</Label>
                                <Input id="filename" name="filename" defaultValue={editingFile.filename} required />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="type">{t("Pages.Dashboard.Files.type")}</Label>
                                <Input id="type" name="type" defaultValue={editingFile.type} required />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="mimetype">{t("Pages.Dashboard.Files.mimetype")}</Label>
                                <Input id="mimetype" name="mimetype" defaultValue={editingFile.mimetype} required />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setEditingFile(null)}>
                                    {t("Pages.Dashboard.Files.cancel")}
                                </Button>
                                <Button type="submit" disabled={saving}>
                                    {saving ? t("Pages.Dashboard.loading") : t("Pages.Dashboard.Files.save")}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
