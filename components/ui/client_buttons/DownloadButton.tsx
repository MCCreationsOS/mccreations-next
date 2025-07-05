'use client'
import { convertToCollection, downloadCreation } from "@/app/api/content"
import { ContentTypes, IFile, NewFile } from "@/app/api/types";
// import { isBedrockType } from "../../old/FormInputs/VersionUploader/VersionManager";
import { useTranslations } from "next-intl";
import { Button } from "../button";
import { Download } from "lucide-react";
import { track } from "@vercel/analytics/react";

export default function DownloadButton({slug, file, contentType, className}: {slug: string, file: IFile, contentType: ContentTypes, className?: string }) {
    const t = useTranslations()
    const collectionName = convertToCollection(contentType)
    if(!file) return <></>

    const downloadButtonClicked = async () => {
        track("download_button_clicked", {creation: slug, type: contentType})
        await downloadCreation(slug, collectionName)

        let files: NewFile[] = [{url: file.url ?? file.worldUrl ?? file.dataUrl ?? file.resourceUrl ?? "", required: true, type: file.type}]
        file.extraFiles && files.push(...file.extraFiles)

        files.forEach(async (file) => {
            if(!file.required) return
            console.log(file.url)
            window.open(file.url, '_blank')
            await new Promise(resolve => setTimeout(resolve, 500))
        })
    }

    let text = t('download')
    // if(isBedrockType(file.type)) {
    //     text = t('Buttons.download_bedrock')
    // }

    return (
        <Button onClick={downloadButtonClicked} className={className}><span className="text-lg font-bold">{text}</span><Download/></Button>
    )
}