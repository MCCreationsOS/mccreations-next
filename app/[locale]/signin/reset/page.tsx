'use client'

import { sendPasswordResetEmail } from "@/app/api/auth"
import { Button } from "@/components/ui/button";
import {useTranslations} from 'next-intl';
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ResetPage() {
    const [email, setEmail] = useState("")
    const router = useRouter()
    const t = useTranslations()
    
    const resetPassword = () => {
        sendPasswordResetEmail(email).then((data) => {
            router.push("/")
        })
    }
    
    return (
        <div className="popup_page">
            <div className="centered_content small popup">
                <h2>{t('Pages.SignIn.Reset.title')}</h2>
                <form>
                    <div className='field'>
                        <p className='label'>{t('Pages.SignIn.Reset.email')}</p>
                        <input className='input wide' type='text' autoComplete="email" name='email' placeholder={t('Pages.SignIn.Reset.email_placeholder')} onChange={(e) => {setEmail(e.target.value)}}></input>
                    </div>
                    <Button onClick={resetPassword}><span>{t('Pages.SignIn.Reset.send_reset_email')}</span></Button>
                </form>
            </div>
        </div>
    )
}