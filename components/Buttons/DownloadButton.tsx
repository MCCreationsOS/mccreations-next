'use client'
import { downloadMap } from "@/app/api/content"
import MainButton from "./MainButton"
import { CollectionNames, IFile, NewFile } from "@/app/api/types";
import { isBedrockType } from "../FormInputs/VersionUploader/VersionManager";
import { useTranslations } from "next-intl";

export default function DownloadButton({slug, file}: {slug: string, file: IFile}) {
    const t = useTranslations()

    const downloadButtonClicked = async () => {
        await downloadMap(slug)

        let files: NewFile[] = [{url: file.url ?? file.worldUrl ?? file.dataUrl ?? file.resourceUrl ?? "", required: true, type: file.type}]
        file.extraFiles && files.push(...file.extraFiles)

        files.forEach((file) => {
            if(!file.required) return
            let a = document.createElement('a')
            a.href = file.url
            a.download = slug
            a.target = '_blank'
            a.click()
            a.remove()
        })
    }

    let text = t('Buttons.download')
    if(isBedrockType(file.type)) {
        text = t('Buttons.download_bedrock')
    }

    return (
        <MainButton onClick={downloadButtonClicked}>{text}</MainButton>
    )
}