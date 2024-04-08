'use client'

import FileDropzone from "./FileUpload"
import styles from '../Input.module.css'
import { useState } from "react"

export interface VersionUploaderProps {
    name: string,
    value?: string,
    description?: string,
    onChange?: (value: string) => void

}

export default function VersionUploader(props: VersionUploaderProps) {
    const [value, setValue] = useState<string>(props.value || "default")

    return (
        <div className='field'>
            <h3 className="label">{props.name}</h3>
            <p className={styles.description}>{props.description}</p>
            <FileDropzone onFilesUploaded={(f) => {setValue(f)}} presetFile={props.value}/>
            <input type="hidden" value={value} />
        </div>
    )
}