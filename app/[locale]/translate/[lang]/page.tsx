'use client'

import FormComponent from '@/components/Form/Form'
import Text from "@/components/FormInputs/Text";
import Menu from '@/components/Menu/Menu'
import { PopupMessage, PopupMessageType } from '@/components/PopupMessage/PopupMessage';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { Link } from "@/app/api/navigation";
import { Suspense, useEffect, useState } from 'react';

type Language = {[key: string]: string}

export default function Page({params}: {params: Params}) {
    const [keys, setKeys] = useState<string[]>([])
    const [currentLanguage, setCurrentLanguage] = useState<Language>({})

    const getKeys = (lang: any) => {
        const formattedLanguage: Language = {}
        Object.keys(lang).forEach((key) => {
            if(typeof lang[key] === 'string') {
                formattedLanguage[key] = lang[key]
            } else {
                for (const k in getKeys(lang[key])) {
                    formattedLanguage[key + "." + k] = getKeys(lang[key])[k]
                }
            }
        })
        return formattedLanguage
    }

    const expandLanguage = (flatLanguage: Language): any => {
        const expandedLanguage: any = {};
        
        for (const [key, value] of Object.entries(flatLanguage)) {
            const keys = key.split('.');
            let current = expandedLanguage;
            
            for (let i = 0; i < keys.length - 1; i++) {
                if (!(keys[i] in current)) {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }
            
            current[keys[keys.length - 1]] = value;
        }
        
        return expandedLanguage;
    };

    useEffect(() => {
        const getLanguage = async () => {
            try {
                const lang = await import(`@/locales/langs/${params.lang}.json`)
                const baseLanguage = await import(`@/locales/langs/en-US.json`)
                const formattedLanguage = getKeys(lang.default)
                setCurrentLanguage(formattedLanguage)
                setKeys(Object.keys(formattedLanguage))
            } catch {
                const lang = await import(`@/locales/langs/en-US.json`)
                const formattedLanguage = getKeys(lang.default)
                setCurrentLanguage(formattedLanguage)
                setKeys(Object.keys(formattedLanguage))
            }
        }
        getLanguage();
    }, [])

    const saveLanguage = (inputs: string[]) => {
        let lang = Object.assign({}, currentLanguage)
        keys.forEach((key, idx) => {
            lang[key] = inputs[idx]
        })
        const expandedLanguage = expandLanguage(lang)
        fetch(`${process.env.DATA_URL}/translation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expandedLanguage)
        })
        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, "Translation successfully sent"))
    }

    return (
        <>
            <Menu selectedPage="" />
            <div className='centered_content'>
                <Suspense>
                    <FormComponent id="add_language" onSave={saveLanguage} options={{stickyButtons: true, saveButtonContent: "Send"}}>
                        <p>Translations are not saved if you leave this page. When you're ready, click send to send the translation to our admins. It doesn't have to be complete, but try and avoid spamming the button.</p>
                        <Link href="https://youtu.be/lhZTkbkuORI">For help, click here</Link>
                        <br></br>
                        <br></br>
                        {keys.map((key) => {
                            return <Text value={currentLanguage[key]} name={key} description={(key === 'language_code') ? <>An <Link href="https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes">ISO 639 language code</Link> follow by an <Link href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements">ISO 3166-1 Region Code</Link>. If you can't find your language, leave this blank.</> : undefined}/>
                        })}
                    </FormComponent>
                </Suspense>
            </div>
        </>
    )
}