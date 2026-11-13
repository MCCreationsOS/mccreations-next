'use client'
import { convertToCollection, downloadCreation } from "@/app/api/content"
import { ContentTypes, IFile } from "@/app/api/types";
import { useTranslations } from "next-intl";
import { Button } from "../button";
import { Download } from "lucide-react";
import { track } from "@vercel/analytics/react";
import { toast } from "sonner";

export default function DownloadButton({ slug, file, contentType, className }: { slug: string, file: IFile, contentType: ContentTypes, className?: string }) {
    const t = useTranslations()
    const collectionName = convertToCollection(contentType)
    if (!file) return <></>

    const downloadButtonClicked = () => {
        track("download_button_clicked", { creation: slug, type: contentType })

        // Open the download straight away, while the click still counts as a user gesture; awaiting
        // anything first makes Safari and Firefox treat it as a popup and block it
        const mainUrl = file.url ?? file.worldUrl ?? file.dataUrl ?? file.resourceUrl ?? ""
        if (mainUrl) window.open(mainUrl, '_blank', 'noopener')

        // Counting the download doesn't need to finish before the file opens
        downloadCreation(slug, collectionName)

        // Browsers only allow one popup per click, so offer any other required files as links
        const extras = (file.extraFiles ?? []).filter((extra) => extra.required && extra.url)
        if (extras.length > 0) {
            toast(t('Components.Creations.Page.extra_files'), {
                duration: 20000,
                description: (
                    <div className="flex flex-col gap-1">
                        {extras.map((extra, index) => (
                            <a key={extra.url} href={extra.url} target="_blank" rel="noopener noreferrer" className="underline">
                                {t('Components.Creations.Page.extra_file', {number: index + 1})}
                            </a>
                        ))}
                    </div>
                )
            })
        }
    }

    return (
        <Button onClick={downloadButtonClicked} className={className}><span className="text-xl font-bold w-full">{t('download')}</span><Download /></Button>
    )
}
