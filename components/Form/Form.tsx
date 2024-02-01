import { useState } from "react";
import Dropzone from "../SingleImageDropzone/SingleImageDropzone";
import styles from './Form.module.css'

export interface IFormInput {
    name: string,
    type: string,
    placeholder?: string,
    value?: string,
    onChange?: (value: string) => void,
    options?: IFormOptions[]
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
        <form method="none">
                    {inputs && inputs.map((input, idx) => {return (
                        (input.type === 'image') ? 
                        <div className='field' key={idx}>
                            <h3 className="label">{input.name}</h3>
                            <Dropzone imageSet={(input.onChange) ? input.onChange: (url) => {input.value = url}} presetImage={(input.value) ? input.value : "/defaultBanner.png"}/>
                        </div>:
                        (input.type === 'select') ?
                        <div className='field' key={idx}>
                            <h3 className="label">{input.name}</h3>
                            <div className={styles.options}>
                                {input.options?.map((option) => {return (
                                    <div className={(option.name === input.value) ? styles.option_selected : styles.option} onClick={() => {input.value = option.name; setOptionSelectRerender(optionSelectRerender+1)}}>{option.name}</div>
                                )})}
                            </div>
                        </div> :
                        (input.type === 'creator') ?
                        <div className='field' key={idx}>
                            <h3 className='label'>{input.name}</h3>
                            <div className={styles.options}>
                                {input.options?.map((option) => {return (
                                    <div className={(option.name === input.value) ? styles.option_selected : styles.option} onClick={() => {input.value = option.name; setOptionSelectRerender(optionSelectRerender+1)}}>{option.name}</div>
                                )})}
                            </div>
                        </div>:
                        <div className='field' key={idx}>
                            <h3 className='label'>{input.name}</h3>
                            <input className='input wide' type={input.type} onChange={(e) => {(input.onChange) ? input.onChange(e.target.value): ""; input.value = e.target.value}} name='data' placeholder={input.placeholder} defaultValue={input.value}></input>
                        </div> 
                    )})}
                    <button type="button" className="main_button" onClick={saveForm}>Save</button>
                    <input type='hidden' value={optionSelectRerender}></input>
                </form>
    )
}