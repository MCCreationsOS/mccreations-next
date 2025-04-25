'use client'
import { ContentTypes, IFile } from "@/app/api/types";
import { Archive, Layers, Package } from "lucide-react";
import styles from './FileCard.module.css';
import { convertToCollection, downloadCreation } from "@/app/api/content";
import { Button } from "../ui/button";

/**
 * A card that displays download options for a file
 * @param file The file to display
 * @param download The function to call when a download button is clicked
 */
export default function FileCard({file, slug, contentType}: {file: IFile, slug: string, contentType: ContentTypes   }) {
    const download = async (url: string) => {
        await downloadCreation(slug, convertToCollection(contentType))
        let a = document.createElement('a')
        a.href = url
        a.download = url.split('/').pop()!
        a.target = '_blank'
        a.click()
        a.remove()
    }

    if(file.url) {
        return (
            <div className={styles.card}>
                <div className={styles.download_options}>
                    <p>{(file.contentVersion) ? file.contentVersion : "1.0"}</p>
                    <Button onClick={() => {download(file.url!)}}>{(file.type === "map") ? <Archive /> : (file.type === 'resourcepack') ? <Layers /> : <Package />} </Button>
                    {file.extraFiles && file.extraFiles.map((extraFile, idx) => {
                        if(idx > 2) return <></>
                        return <Button key={extraFile.url} onClick={() => {download(extraFile.url)}}>{(extraFile.type === "map") ? <Archive /> : (extraFile.type === 'resourcepack') ? <Layers /> : <Package /> }</Button>
                    })}
                </div>
            </div>
        )
    }
    return (
        <div className={styles.card}>
            <div className={styles.download_options}>
                <p>{(file.contentVersion) ? file.contentVersion : "1.0"}</p>
                {(file.worldUrl) ? <Button onClick={() => {download(file.worldUrl!)}}><Archive /></Button>: <></>}
                {(file.dataUrl) ? <Button onClick={() => {download(file.dataUrl!)}}><Package/></Button> : <></>}
                {(file.resourceUrl) ? <Button onClick={() => {download(file.resourceUrl!)}}><Layers /></Button> : <></>}
            </div>
        </div>
    )
}