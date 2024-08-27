import { useChangeLocale, useCurrentLocale } from "@/locales/client";
import Link from "next/link";
import { useState } from "react";
import { Globe, Plus } from "react-feather";
import { Popup } from "../Popup/Popup";
import FormComponent from "../Form/Form";
import Text from "../FormInputs/Text";
import * as keys from '@/locales/langs/en_US'

export default function LanguageSwitcher() {
    const changeLocale = useChangeLocale();
    const currentLocale = useCurrentLocale();
    const [open, setOpen] = useState(false);
    const langKeys = Object.keys(keys.default)

    const addLanguage = () => {
        Popup.createPopup({
            title: "Add A Language",
            canClose: true,
            useBackground: true,
            content: <FormComponent id="add_language" onSave={saveNewLanguage} >
                <Link href="">For help, click here</Link>
                <br></br>
                <br></br>
                {langKeys.map((key) => {
                    return <Text name={key} description={(key === 'language.code') ? <>An <Link href="https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes">ISO 639 language code</Link> follow by an <Link href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements">ISO 3166-1 Region Code</Link>. If you can't find your language, leave this blank.</> : undefined}/>
                })}
            </FormComponent>
        })
    }

    const saveNewLanguage = (inputs: string[]) => {}

    return (
        <div className="select" style={{width:"100%", margin: 0}} onClick={() => {setOpen(!open)}}>
            <button className="selected_option" style={{padding: "0px 8px"}}><Globe /></button>
            <div className="options" style={{display: (open) ? "block": "none", left: "-320%"}}>
                <div className={(currentLocale === 'en-US') ? "option selected" : "option"} style={{fontSize: "0.9rem"}} onClick={() =>{changeLocale('en-US')}}>
                    US English
                </div>
                <div className={(currentLocale === 'zh-CN') ? "option selected" : "option"} style={{fontSize: "0.9rem"}} onClick={() =>{changeLocale('zh-CN')}}>
                    简体中文
                </div>
                <div className="option icon" style={{fontSize: "0.9rem"}}>
                    <div onClick={addLanguage}><Plus /></div> <div onClick={addLanguage}> Add A Language</div>
                </div>
            </div>
        </div>
    )
}