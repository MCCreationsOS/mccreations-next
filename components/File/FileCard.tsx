'use client'
import { IFile } from "@/app/api/types";
import { Archive, Layers, Package } from "react-feather";
import styles from './FileCard.module.css';
import IconButton from "../Buttons/IconButton";
import { downloadMap } from "@/app/api/content";

/**
 * A card that displays download options for a file
 * @param file The file to display
 * @param download The function to call when a download button is clicked
 */
export default function FileCard({file, slug}: {file: IFile, slug: string}) {
    const download = async (url: string) => {
        await downloadMap(slug)
        let a = document.createElement('a')
        a.href = url
        a.download = url.split('/').pop()!
        a.target = '_blank'
        a.click()
        a.remove()
    }

    return (
        <div className={styles.card}>
            <div className={styles.download_options}>
                <p>{(file.contentVersion) ? file.contentVersion : "1.0"}</p>
                {(file.worldUrl) ? <IconButton onClick={() => {download(file.worldUrl)}}><Archive /></IconButton>: <></>}
                {(file.dataUrl) ? <IconButton onClick={() => {download(file.dataUrl!)}}><Package/></IconButton> : <></>}
                {(file.resourceUrl) ? <IconButton onClick={() => {download(file.resourceUrl!)}}><Layers /></IconButton> : <></>}
            </div>
        </div>
    )
}