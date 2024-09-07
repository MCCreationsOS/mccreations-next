'use client'

import RichText from "./RichText"
import styles from '../Input.module.css'
import { FormElement } from "@/components/Form/Form"
import { useEffect, useRef, useState } from "react"
import { on } from "events"

export interface RichTextInputProps {
    name: string,
    id: string,
    value?: string,
    description?: string
    onChange?: (value: string) => void
}

export class RichTextManager {
    static richTexts: RichTextClass[] = []

    static registerRichText(richText: RichTextClass) {
        this.richTexts.push(richText)
    }

    static unregisterRichText(richText: RichTextClass) {
        this.richTexts = this.richTexts.filter(r => r !== richText)
    }

    static getRichTexts() {
        return this.richTexts
    }

    static getRichText(id: string) {
        return this.richTexts.find(r => r.id === id)
    }
}

export class RichTextClass {
    private value: string
    id: string
    onSubmits: ((value: string) => void)[] = []

    constructor(value: string, id: string) {
        this.value = value
        this.id = id
    }

    setValue(value: string) {
        this.value = value
    }

    getValue() {
        this.onSubmits.forEach(cb => cb(this.value))
        return this.value
    }

    onSubmit(callback: (value: string) => void) {
        this.onSubmits.push(callback)
        return this
    }
}

export default function RichTextInput(props: RichTextInputProps): FormElement {
    const [initialValue, setInitialValue] = useState<string>(props.value ?? "")
    const richText = useRef<RichTextClass | null>(null)

    useEffect(() => {
        if(richText.current) {
            richText.current.setValue(initialValue + "")
        } else {
            richText.current = new RichTextClass(initialValue + "", props.id).onSubmit((value) => {
                setInitialValue(value)
            })
        }
        RichTextManager.registerRichText(richText.current)
        return () => {
            RichTextManager.unregisterRichText(richText.current!)
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