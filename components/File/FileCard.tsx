import { IFile } from "@/app/types";
import Link from "next/link";
import { Archive, Box, Compass } from "react-feather";
import styles from './FileCard.module.css';

export default function FileCard({file}: {file: IFile}) {

    return (
        <div className={styles.card}>
            <div className={styles.download_options}>
                <p>{(file.contentVersion) ? file.contentVersion : "1.0"}</p>
                {(file.worldUrl) ? <Link title="Download Complete World" className={styles.button} href={file.worldUrl}><Archive /></Link> : <></>}
                {(file.resourceUrl) ? <Link title="Download Resourcepack" className={styles.button}  href={file.resourceUrl}><Compass /></Link> : <></>}
                {(file.dataUrl) ? <Link title="Download Datapack" className={styles.button}  href={file.dataUrl}><Box /></Link> : <></>}
            </div>
        </div>
    )
}