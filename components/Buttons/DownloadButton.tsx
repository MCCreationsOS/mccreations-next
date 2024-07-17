'use client'
import { downloadMap } from "@/app/api/content"
import MainButton from "./MainButton"
import { useRouter } from "next/navigation"

export default function DownloadButton({slug, url}: {slug: string, url: string}) {
    const router = useRouter();
    const downloadButtonClicked = async () => {
        await downloadMap(slug)
        router.push(url)
    }

    return (
        <MainButton onClick={downloadButtonClicked}>Download</MainButton>
    )
}