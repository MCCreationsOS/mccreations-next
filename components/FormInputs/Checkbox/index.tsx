'use client'

import { useRef, useState } from "react";
import styles from '../Input.module.css'
import { FormElement } from "@/components/Form/Form";
import IconButton from "@/components/Buttons/IconButton";
import { CheckSquare, Square } from "react-feather";

export interface CheckboxProps {
    name: string,
    type?: string,
    placeholder?: string,
    value?: string,
    onChange?: (value: string) => void,
    description?: string

}

export interface CheckboxElement extends FormElement {
    props: CheckboxProps
}

/**
 * A text form element
 * @param name The name of the input
 * @param type The type of the input - passed directly into the HTML input element type
 * @param placeholder The placeholder of the input
 * @param value The value of the input, can be set to a default value
 * @param description A description of the input
 * @param onChange The function to call when the value of the input changes
 * @returns 
 */
export default function Checkbox(props: CheckboxProps): CheckboxElement {
    const [value, setValue] = useState(props.value || "false")

    return (
        <div className='field'>
            <p className={styles.description}>{props.description}</p>
            <div className={styles.checkbox_field}>
                <IconButton className="secondary" onClick={() => {(value === "true") ? setValue("false") : setValue("true")}}>{(value === "true") ? <CheckSquare/> : <Square/>}</IconButton>
                <h3 className='label'>{props.name}</h3>
            </div>
            <input type='hidden' value={value} />
        </div> 
    )
}