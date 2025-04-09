import { X } from "lucide-react";
import styles from './MediaGallery.module.css'
import { Draggable } from "react-beautiful-dnd";

interface DragImage {
    id: string,
    index: number
}

/**
 * A single image in the gallery
 * @param id The id of the image
 * @param idx The index of the image
 * @param url The url of the image
 * @param name The name of the image
 * @param removeFile The function to call when the X button is clicked
 * @param moveFile The function to call when the image is moved - Unused for now
 */
export default function GalleryImage({id, idx, url, name, removeFile, moveFile}: {id: string, idx: number, url: string, name: string, removeFile: (name: string) => void, moveFile: (from: number, to: number) => void}) {
    
    return (
        <div className={styles.image}>
            <img src={url} />
            <button className={styles.remove} onClick={() => removeFile(name)}><X /></button>
        </div>
    )
}