import { useState } from "react";
import ImageDropzone, { UploadedImageRepresentation } from "../FormInputs/ImageDropzone/ImageDropzone";
import styles from './Form.module.css'
import CreatorSelector from "../FormInputs/CreatorSelector/CreatorSelector";
import FileDropzone from "../FormInputs/VersionUploader/FileUpload";
import RichText from "../FormInputs/RichText/RichText";
import MainButton from "../Buttons/MainButton";

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

export default function FormComponent({id, children, onSave}: {id: string, children: FormElement[] | FormElement, onSave: (inputs: string[]) => void}) {
    const saveForm = () => {
        let inputs: string[] = []
        document.querySelector('#' + id)?.querySelectorAll('input').forEach((input) => {
            if(input.getAttribute('name') === 'file') return;
            inputs.push(input.value)
        })
        onSave(inputs)
    }

    let otherForms = document.querySelectorAll('#' + id)
    if(otherForms.length > 0) {
        console.warn('Form with id ' + id + ' already exists. This may cause unexpected behavior')
    }

    return (
        <div id={id}>
            {children}
            <MainButton onClick={saveForm}>Save</MainButton>
        </div>
    )
}