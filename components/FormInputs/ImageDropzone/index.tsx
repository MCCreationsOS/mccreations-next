'use client'

import ImageDropzone from "./ImageDropzone"
import styles from '../Input.module.css'
import { FormElement } from "@/components/Form/Form"
import { useState } from "react"

export interface ImageInputProps {
    name: string,
    value?: string,
    allowMultiple?: boolean,
    description?: string,
    onChange?: (value: string) => void
}

export interface ImageInput extends FormElement {
    props: ImageInputProps
}

export default function ImageInput(props: ImageInputProps): ImageInput {
    const [value, setValue] = useState<string>(props.value || "")

    return (
        <div className='field'>
            <h3 className="label">{props.name}</h3>
            <p className={styles.description}>{props.description}</p>
            <ImageDropzone allowMultiple={props.allowMultiple || false} onImagesUploaded={(files) => {setValue(JSON.stringify(files))}} presetImage={(props.value) ? props.value : "/defaultBanner.png"}/>
            <input type="hidden" value={value} />
        </div>
    )
}