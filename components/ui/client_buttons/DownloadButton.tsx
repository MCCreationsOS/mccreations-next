'use client'
import { convertToCollection, downloadCreation } from "@/app/api/content"
import { ContentTypes, IFile, NewFile } from "@/app/api/types";
// import { isBedrockType } from "../../old/FormInputs/VersionUploader/VersionManager";
import { useTranslations } from "next-intl";
import { Button } from "../button";

export default function DownloadButton({slug, file, contentType}: {slug: string, file: IFile, contentType: ContentTypes }) {
    const t = useTranslations()
    const collectionName = convertToCollection(contentType)
    if(!file) return <></>

    const downloadButtonClicked = async () => {
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

    let text = t('Buttons.download')
    // if(isBedrockType(file.type)) {
    //     text = t('Buttons.download_bedrock')
    // }

    return (
        <Button onClick={downloadButtonClicked}>{text}</Button>
    )
}