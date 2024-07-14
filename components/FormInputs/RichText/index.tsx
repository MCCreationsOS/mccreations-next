'use client'

import RichText from "./RichText"
import styles from '../Input.module.css'
import { FormElement } from "@/components/Form/Form"
import { useRef, useState } from "react"

export interface RichTextInputProps {
    name: string,
    value?: string,
    description?: string
    onChange?: (value: string) => void
}

export default function RichTextInput(props: RichTextInputProps): FormElement {
    const [value, setValue] = useState(props.value || "")

    return (
        <div className='field'>
            <h3 className='label'>{props.name}</h3>
            <p className={styles.description}>{props.description}</p>
            <RichText initialValue={props.value} sendOnChange={(v) => {setValue(v); if(props.onChange) props.onChange(v);}}/>
            <input type='hidden' value={value} />
        </div>
    )
}