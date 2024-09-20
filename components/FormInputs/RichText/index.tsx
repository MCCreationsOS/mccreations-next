'use client'

import RichText from "./RichText"
import styles from '../Input.module.css'
import { FormElement } from "@/components/Form/Form"
import { useEffect, useRef, useState } from "react"
import { on } from "events"
import { FormInput } from ".."

export interface RichTextInputProps {
    name: string,
    id: string,
    value?: string,
    description?: string
    onChange?: (value: string) => void
}

export default function RichTextInput(props: RichTextInputProps): FormElement {
    const [initialValue, setInitialValue] = useState<string>(props.value ?? "")
    const richText = useRef<FormInput<string> | null>(null)

    useEffect(() => {
        if(richText.current) {
            richText.current.setValue(initialValue + "")
        } else {
            richText.current = new FormInput<string>(props.id, initialValue + "").onSubmit((value) => {
                if(value) setInitialValue(value)
            }).onClear(() => {
                setInitialValue("<span></span>")
            })
        }

        FormInput.registerFormInput(richText.current)

        return () => {
            FormInput.unregisterFormInput(richText.current!)
        }
    }, [initialValue])

    return (
        <div className='field'>
            <h3 className='label'>{props.name}</h3>
            <p className={styles.description}>{props.description}</p>
            <RichText initialValue={initialValue} sendOnChange={(v) => {if (richText.current) richText.current.setValue(v);if(props.onChange) props.onChange(v);}}/>
        </div>
    )
}