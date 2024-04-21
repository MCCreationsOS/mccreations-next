'use client'

import { useEffect, useState } from "react"
import styles from '../Input.module.css'
import { FormElement } from "@/components/Form/Form"

export interface SelectProps {
    name: string,
    value?: string,
    options?: ISelectOptions[],
    description?: string
    onChange?: (value: string) => void,
    multiSelect?: boolean
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

    const isOptionSelected = (option: ISelectOptions) => {
        if (props.multiSelect) {
            let newValue = value.split(",")
            return (newValue.includes(option.value || option.name)) ? styles.option_selected : styles.option
        } else {
            return (option.value === value || option.name === value) ? styles.option_selected : styles.option
        }
    }

    const selectOption = (option: ISelectOptions) => {
        if(props.multiSelect) {
            let newValue = value.split(",")
            if (newValue.includes(option.value || option.name)) {
                console.log("removing", option.value || option.name)
                newValue = newValue.filter((val) =>  !(option.value && val === option.value) && val !== option.name)
            } else {
                console.log("adding", option.value || option.name)
                newValue.push(option.value || option.name)
            }
            setValue(newValue.join(","))
        } else {
            setValue((option.value) ? option.value : option.name)
        }
    }

    return (
        <div className='field'>
            <h3 className="label">{props.name}</h3>
            <p className={styles.description}>{props.description}</p>
            <div className={styles.options}>
                {props.options?.map((option, idx) => {return (
                    <div key={idx} className={isOptionSelected(option)} onClick={() => {selectOption(option)}}>{option.name}</div>
                )})}
            </div>
            <input type="hidden" value={value || ""} />
        </div>
    )
}