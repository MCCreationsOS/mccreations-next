import { IFile } from "@/app/types";
import Link from "next/link";
import { Archive, Box, Compass } from "react-feather";
import styles from './FileCard.module.css';

/**
 * A card that displays download options for a file
 * @param file The file to display
 * @param download The function to call when a download button is clicked
 */
export default function FileCard({file, download}: {file: IFile, download: (url: string) => void}) {

    return (
        <div className={styles.card}>
            <div className={styles.download_options}>
                <p>{(file.contentVersion) ? file.contentVersion : "1.0"}</p>
                {(file.worldUrl) ? <span title="Download Complete World" className={styles.button}  onClick={() => {download(file.worldUrl)}}><Archive /></span> : <></>}
                {(file.resourceUrl) ? <Link title="Download Resourcepack" className={styles.button}  href={file.resourceUrl}><Compass /></Link> : <></>}
                {(file.dataUrl) ? <Link title="Download Datapack" className={styles.button}  href={file.dataUrl}><Box /></Link> : <></>}
            </div>
        </div>
    )
}