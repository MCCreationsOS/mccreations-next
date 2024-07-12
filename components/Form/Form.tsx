import { useEffect, useState } from "react";
import ImageDropzone, { UploadedImageRepresentation } from "../FormInputs/ImageDropzone/ImageDropzone";
import styles from './Form.module.css'
import CreatorSelector from "../FormInputs/CreatorSelector/CreatorSelector";
import FileDropzone from "../FormInputs/VersionUploader/FileUpload";
import RichText from "../FormInputs/RichText/RichText";
import MainButton from "../Buttons/MainButton";

/**
 * A FormElement is a JSX element that represents a form element. It must have a name prop and can have a value, description, and onChange prop. The onChange prop is a function that takes in the value of the input and the index of the input in the form.
 * This base interface is extended by other form elements to add additional props
 */
export interface FormElement extends JSX.Element {
    type: any;
    props: {
        name: string,
        value?: string,
        description?: string,
        onChange?: (value: string, index: number) => void
    }
    key: string | null;
}

export interface FormOptions {
    useSaveButton?: boolean
    saveButtonContent?: React.ReactNode
    saveButtonType?: 'primary' | 'secondary' | 'warning' | 'hollow' | 'icon'
    extraButtons?: JSX.Element[]
}

/**
 * A form component that takes in FormElements as children and a function to call when the form is saved. The values of all of the FormElements is passed to the onSave function as a list of strings. Each form must have a unique id
 * @param id The id of the form - Must be unique on the page
 * @param children The FormElements that make up the form
 * @param onSave The function to call when the form is saved 
 */
export default function FormComponent({id, children, onSave, options}: {id: string, children?: FormElement[] | FormElement, onSave: (inputs: string[]) => void, options?: FormOptions}) {
    const saveForm = () => {
        let inputs: string[] = []
        document.querySelector('#' + id)?.querySelectorAll('input').forEach((input) => {
            if(input.getAttribute('name') === 'file') return;
            inputs.push(input.value)
        })
        onSave(inputs)
    }

    useEffect(() => {
        let otherForms = document.querySelectorAll('#' + id)
        if(otherForms.length > 1) {
            console.warn('Form with id ' + id + ' already exists. This may cause unexpected behavior')
        }
    }, [])

    return (
        <div id={id}>
            {children}
            {(options?.useSaveButton === undefined || options.useSaveButton) && (options?.saveButtonType === 'primary' || !options?.saveButtonType) && <MainButton onClick={saveForm}>{options?.saveButtonContent || 'Save'}</MainButton>}
            {(options?.useSaveButton === undefined || options.useSaveButton) && (options?.saveButtonType === 'secondary') && <MainButton onClick={saveForm}>{options.saveButtonContent || 'Save'}</MainButton>}
            {(options?.useSaveButton === undefined || options.useSaveButton) && (options?.saveButtonType === 'warning') && <MainButton onClick={saveForm}>{options.saveButtonContent || 'Save'}</MainButton>}
            {(options?.useSaveButton === undefined || options.useSaveButton) && (options?.saveButtonType === 'hollow') && <MainButton onClick={saveForm}>{options.saveButtonContent || 'Save'}</MainButton>}
            {(options?.useSaveButton === undefined || options.useSaveButton) && (options?.saveButtonType === 'icon') && <MainButton onClick={saveForm}>{options.saveButtonContent || 'Save'}</MainButton>}

            {options?.extraButtons}
        </div>
    )
}