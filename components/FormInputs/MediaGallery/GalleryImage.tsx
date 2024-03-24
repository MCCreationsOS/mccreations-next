import { X } from "react-feather";
import styles from './MediaGallery.module.css'
import { Draggable } from "react-beautiful-dnd";

interface DragImage {
    id: string,
    index: number
}

export default function GalleryImage({id, idx, url, name, removeFile, moveFile}: {id: string, idx: number, url: string, name: string, removeFile: (name: string) => void, moveFile: (from: number, to: number) => void}) {
    
    return (
        <div className={styles.image}>
            <img src={url} />
            <button className={styles.remove} onClick={() => removeFile(name)}><X /></button>
        </div>
    )
}