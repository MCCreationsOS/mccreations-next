'use client'

import { useState } from 'react'
import styles from './PopupForm.module.css'
import { X } from 'react-feather'
import Dropzone from "../SingleImageDropzone/SingleImageDropzone";

export interface IPopupInput {
    name: string,
    type: string,
    placeholder?: string,
    defaultValue?: string,
    value?: string
    onChange?: (value: string) => void
}

export class PopupForm {
    static inputs: IPopupInput[]
    static title: string
    static onSave: () => void
    static onOpen: () => void
    static onClose: () => void

    static openForm(title: string, inputs: IPopupInput[], onSave: () => void) {
        this.title = title;
        this.inputs = inputs
        this.onSave = onSave
        PopupForm.onOpen();
    }

    static closeForm() {
        PopupForm.onClose();
    }

    static saveForm() {
        PopupForm.onSave()
        PopupForm.onClose()
    }
}

export default function PopupFormComponent() {
    const [formOpen, setFormOpen] = useState(false);
    const [title, setTitle] = useState("")
    const [inputs, setInputs] = useState<IPopupInput[]>();

    PopupForm.onOpen = () => {
        setFormOpen(true)
        setTitle(PopupForm.title)
        setInputs(PopupForm.inputs)
    }

    PopupForm.onClose = () => {
        setFormOpen(false);
    }
    
    return (
        <>
            <div className="popup_background" style={{display: (formOpen) ? "block": "none"}}></div>
            <div className="centered_content popup small" style={{display: (formOpen) ? "block": "none"}}>
                <div className="titlebar">
                    <h3 className='label title'>{PopupForm.title}</h3>
                    <div className="close" onClick={() => {PopupForm.closeForm()}}><X /></div>
                </div>
                <form>
                    {PopupForm.inputs && PopupForm.inputs.map((input, idx) => {return (
                        (input.type !== 'image') ? 
                        <div className='field' key={idx}>
                            <h4 className='label'>{input.name}</h4>
                            <input className='input wide' type={input.type} onChange={(e) => {(input.onChange) ? input.onChange(e.target.value): ""; input.value = e.target.value}} name='data' placeholder={input.placeholder} defaultValue={input.defaultValue}></input>
                        </div> :
                        <div className='field'>
                            <h4 className="label">{input.name}</h4>
                            <Dropzone imageSet={(input.onChange) ? input.onChange: (url) => {input.value = url}} presetImage={input.placeholder}/>
                        </div>
                    )})}
                    <button type="button" className="main_button" onClick={PopupForm.saveForm}>Save</button>
                </form>
            </div>
        </>
    )
}