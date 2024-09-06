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
                <h2>{t('account.reset_password')}</h2>
                <form>
                    <div className='field'>
                        <p className='label'>{t('account.email')}</p>
                        <input className='input wide' type='text' autoComplete="email" name='email' placeholder={t('account.email_placeholder')} onChange={(e) => {setEmail(e.target.value)}}></input>
                    </div>
                    <MainButton onClick={resetPassword}>{t('account.reset_password.send_reset_email')}</MainButton>
                </form>
            </div>
        </div>
    )
}