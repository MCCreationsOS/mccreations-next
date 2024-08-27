'use client'

import FormComponent from '@/components/Form/Form'
import Text from "@/components/FormInputs/Text";
import Menu from '@/components/Menu/Menu'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react';

export default function Page({params}: {params: Params}) {
    const [keys, setKeys] = useState<string[]>([])
    const [currentLanguage, setCurrentLanguage] = useState<{[key: string]: string}>({})

    useEffect(() => {
        const getLanguage = async () => {
            try {
                const lang = await import(`@/locales/langs/${params.lang}`)
                const keys = await import(`@/locales/langs/en_US`)
                setCurrentLanguage(lang.default)
                setKeys(Object.keys(keys.default))
            } catch {
                const lang = await import(`@/locales/langs/en_US`)
                setKeys(Object.keys(lang.default))
                setCurrentLanguage(lang.default)
            }
        }
        getLanguage();
    })

    const saveLanguage = (inputs: string[]) => {
        let lang = Object.assign({}, currentLanguage)
        keys.forEach((key, idx) => {
            lang[key] = inputs[idx]
        })
        fetch(`${process.env.DATA_URL}/translation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(lang)
        })
    }

    return (
        <>
            <Menu selectedPage="" />
            <div className='centered_content'>
                <Suspense>
                    <FormComponent id="add_language" onSave={saveLanguage} options={{stickyButtons: true, saveButtonContent: "Send"}}>
                        <p>Translations are not saved if you leave this page. When you're ready, click send to send the translation to our admins. It doesn't have to be complete, but try and avoid spamming the button.</p>
                        <Link href="">For help, click here</Link>
                        <br></br>
                        <br></br>
                        {keys.map((key) => {
                            return <Text value={currentLanguage[key]} name={key} description={(key === 'language.code') ? <>An <Link href="https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes">ISO 639 language code</Link> follow by an <Link href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements">ISO 3166-1 Region Code</Link>. If you can't find your language, leave this blank.</> : undefined}/>
                        })}
                    </FormComponent>
                </Suspense>
            </div>
        </>
    )
}