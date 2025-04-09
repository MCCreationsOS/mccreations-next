'use client'

import ImageDropzone from "./ImageDropzone"
import styles from '../Input.module.css'
import { FormElement } from "@/components/Form/Form"
import { useState } from "react"

/**
 * Extend FormElement to include an 'allowMultiple' property
 */
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

/**
 * An ImageInput form element
 * @param name The name of the input
 * @param value The value of the input, can be set to a default value
 * @param allowMultiple Whether or not the input should allow multiple images to be uploaded
 * @param description A description of the input 
 * @returns 
 */
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