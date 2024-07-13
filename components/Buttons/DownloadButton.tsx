'use client'
import { downloadMap } from "@/app/api/content"
import MainButton from "./MainButton"
import router from "next/router"

export default function DownloadButton({slug, url}: {slug: string, url: string}) {
    const downloadButtonClicked = async () => {
        await downloadMap(slug)
        router.push(url)
    }

    return (
        <MainButton onClick={downloadButtonClicked}>Download</MainButton>
    )
}