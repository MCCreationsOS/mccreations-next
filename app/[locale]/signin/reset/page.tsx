'use client'

import { sendPasswordResetEmail } from "@/app/api/auth"
import MainButton from "@/components/Buttons/MainButton"
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
                <h2>{t('SignIn.Reset.title')}</h2>
                <form>
                    <div className='field'>
                        <p className='label'>{t('Account.Shared.email')}</p>
                        <input className='input wide' type='text' autoComplete="email" name='email' placeholder={t('Account.Shared.email_placeholder')} onChange={(e) => {setEmail(e.target.value)}}></input>
                    </div>
                    <MainButton onClick={resetPassword}>{t('SignIn.Reset.send_reset_email')}</MainButton>
                </form>
            </div>
        </div>
    )
}