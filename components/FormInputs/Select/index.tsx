'use client'

import { useEffect, useState } from "react"
import styles from '../Input.module.css'
import { FormElement } from "@/components/Form/Form"

export interface SelectProps {
    name: string,
    value?: string,
    options?: ISelectOptions[],
    description?: string
    onChange?: (value: string) => void
}

export interface ISelectOptions {
    name: string,
    value?: string
}

export interface SelectElement extends FormElement {
    props: SelectProps
}

export default function Select(props: SelectProps): SelectElement {
    const [value, setValue] = useState(props.value || props.options?.[0].value || props.options?.[0].name || "")

    useEffect(() => {
        (props.onChange) ? props.onChange(value + "") : ""
    }, [value])

    return (
        <div className='field'>
            <h3 className="label">{props.name}</h3>
            <p className={styles.description}>{props.description}</p>
            <div className={styles.options}>
                {props.options?.map((option, idx) => {return (
                    <div key={idx} className={(option.value === value || option.name === value) ? styles.option_selected : styles.option} onClick={() => {setValue((option.value) ? option.value : option.name)}}>{option.name}</div>
                )})}
            </div>
            <input type="hidden" value={value || ""} />
        </div>
    )
}