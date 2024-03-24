import { useState } from "react";
import ImageDropzone, { UploadedImageRepresentation } from "../FormInputs/ImageDropzone/ImageDropzone";
import styles from './Form.module.css'
import { FilePreview, IFile } from "@/app/types";
import CreatorSelector from "../FormInputs/CreatorSelector/CreatorSelector";
import FileDropzone from "../FormInputs/VersionUploader/FileUpload";
import RichText from "../FormInputs/RichText/RichText";
import MainButton from "../Buttons/MainButton";

export interface IFormInput {
    name: string,
    type: 'image' | 'select'| 'creator'| 'text' | 'long_text' | 'multi_image'| 'file' | 'password',
    placeholder?: string,
    value?: string,
    onChange?: (value: string) => void,
    options?: IFormOptions[],
    description?: string
}

export interface IFormOptions {
    name: string,
    value?: string
}

export default function FormComponent({inputs, onSave}: {inputs: IFormInput[], onSave: (inputs: IFormInput[]) => void}) {
    const [optionSelectRerender, setOptionSelectRerender] = useState(0)

    const saveForm = () => {
        onSave(inputs);
    }

    return (
        <div>
                    {inputs && inputs.map((input, idx) => {
                        switch(input.type) {
                            case 'text':
                                return (
                                    <div className='field' key={idx}>
                                        <h3 className='label'>{input.name}</h3>
                                        <p className={styles.description}>{input.description}</p>
                                        <input className='input wide' type={input.type} onChange={(e) => {(input.onChange) ? input.onChange(e.target.value): ""; input.value = e.target.value}} name='data' placeholder={input.placeholder} defaultValue={input.value}></input>
                                    </div> 
                                )
                            case 'password': 
                                return (
                                    <div className='field' key={idx}>
                                        <h3 className='label'>{input.name}</h3>
                                        <p className={styles.description}>{input.description}</p>
                                        <input className='input wide' type={input.type} onChange={(e) => {(input.onChange) ? input.onChange(e.target.value): ""; input.value = e.target.value}} name='data' placeholder={input.placeholder} defaultValue={input.value}></input>
                                    </div> 
                                )
                            case 'long_text':
                                return (
                                    <div className='field' key={idx}>
                                        <h3 className='label'>{input.name}</h3>
                                        <p className={styles.description}>{input.description}</p>
                                        <RichText initialValue={input.value} sendOnChange={(v) => {input.value = v}}/>
                                    </div>
                                )
                            case 'select':
                                return (
                                    <div className='field' key={idx}>
                                        <h3 className="label">{input.name}</h3>
                                        <p className={styles.description}>{input.description}</p>
                                        <div className={styles.options}>
                                            {input.options?.map((option, idx) => {return (
                                                <div key={idx} className={(option.value === input.value) ? styles.option_selected : styles.option} onClick={() => {input.value = (option.value) ? option.value : option.name; setOptionSelectRerender(optionSelectRerender+1)}}>{option.name}</div>
                                            )})}
                                        </div>
                                    </div>
                                )
                            case 'creator':
                                return (
                                    <CreatorSelector key={idx} onChange={(creators) => {input.value = JSON.stringify(creators); console.log('Creator loaded')}} />
                                )
                            case 'image':
                                return (
                                    <div className='field' key={idx}>
                                        <h3 className="label">{input.name}</h3>
                                        <p className={styles.description}>{input.description}</p>
                                        <ImageDropzone allowMultiple={false} onImagesUploaded={(input.onChange) ? (files) => {input.onChange!(JSON.stringify(files))}: (files) => {input.value = JSON.stringify(files)}} presetImage={(input.value) ? input.value : "/defaultBanner.png"}/>
                                    </div>
                                )
                            case 'multi_image':
                                return (
                                    <div className='field' key={idx}>
                                        <h3 className="label">{input.name}</h3>
                                        <p className={styles.description}>{input.description}</p>
                                        <ImageDropzone allowMultiple={true} onImagesUploaded={(input.onChange) ? (files) => {input.onChange!(JSON.stringify(files))}: (files) => {input.value = JSON.stringify(files)}} presetImage={(input.value) ? input.value : "/defaultBanner.png"} presetFiles={input.value}/>
                                    </div>
                                )
                            case "file":
                                return (
                                    <div className='field' key={idx}>
                                        <h3 className="label">{input.name}</h3>
                                        <p className={styles.description}>{input.description}</p>
                                        <FileDropzone onFilesUploaded={(input.onChange) ? (file) => {input.onChange!(file)} : (file) => {input.value = file}} presetFile={input.value}/>
                                    </div>
                                )
                        }
                        })}
                    <MainButton onClick={saveForm}>Save</MainButton>
                    <input type='hidden' value={optionSelectRerender}></input>
                </div>
    )
}