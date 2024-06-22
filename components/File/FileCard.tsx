import { IFile } from "@/app/types";
import Link from "next/link";
import { Archive, Box, Compass, Globe, Map } from "react-feather";
import styles from './FileCard.module.css';
import IconButton from "../Buttons/IconButton";

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
                <IconButton onClick={() => {download(file.worldUrl)}}><Archive /></IconButton>
                {(file.resourceUrl) ? <Link title="Download Resourcepack" href={file.resourceUrl}><IconButton><Compass /></IconButton></Link> : <></>}
                {(file.dataUrl) ? <Link title="Download Datapack" href={file.dataUrl}><IconButton><Box/></IconButton></Link> : <></>}
            </div>
        </div>
    )
}