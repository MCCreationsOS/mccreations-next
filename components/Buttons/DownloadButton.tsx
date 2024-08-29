'use client'
import { downloadMap } from "@/app/api/content"
import MainButton from "./MainButton"
import { CollectionNames, IFile, NewFile } from "@/app/api/types";

export default function DownloadButton({slug, file}: {slug: string, file: IFile}) {
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

    return (
        <MainButton onClick={downloadButtonClicked}>Download</MainButton>
    )
}