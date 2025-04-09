'use client'

import { useRef } from "react";
import styles from '../Input.module.css'
import { FormElement } from "@/components/Form/Form";

export interface TextProps {
    name: string,
    type?: string,
    placeholder?: string,
    value?: string,
    onChange?: (value: string) => void,
    description?: React.ReactNode

}

export interface TextElement extends FormElement {
    props: TextProps
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
export default function Text(props: TextProps): TextElement {

    return (
        <div className='field'>
            <h3 className='label'>{props.name}</h3>
            <p className={styles.description}>{props.description}</p>
            <input className='input wide' type={props.type || 'text'} onChange={(e) => {(props.onChange) ? props.onChange(e.target.value): ""}} name='data' placeholder={props.placeholder} defaultValue={props.value}></input>
        </div> 
    )
}