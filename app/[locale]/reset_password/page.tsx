'use client'
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { resetPassword } from "@/app/api/auth";
import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage";
import MainButton from "@/components/Buttons/MainButton";
import { useI18n } from "@/locales/client";

export default function Page() {
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const params = useSearchParams()
    const router = useRouter();
    const t = useI18n();

    let token: string | null
    
    useEffect(() => {
        token = params.get('token')
        if(!token) {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Warning, t('account.reset_password.token_error'), () => {
                router.back()
            }))
            return;
        }
    }, [])

    const updatePassword = async () => {
        token = params.get('token')
        if(!token) {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Warning, t('account.reset_password.token_error'), () => {
                router.back()
            }))
            return;
        }
        if(password === password2) {

            if(!password || password.length < 9) {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('account.reset_password.password_length')))
                return;
            }
    
            let regex = /[0-9]/g, m;
            m = regex.exec(password)
            if(!m) {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('account.reset_password.password_number')))
                return;
            }

            let error = await resetPassword(token!, password)
            if(error) {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, error))
            }
            router.push("/signin")
        } else {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('account.reset_password.passwords_not_same')))
            return;
        }
    }

    return (
        <div className="popup_page">
            <div className="centered_content small popup">
                <h2>{t('account.reset_password')}</h2>
                <form>
                    <div className='field'>
                        <p className='label'>{t('account.reset_password.new_password')}</p>
                        <input className='input wide' type='password' autoComplete="password" name='password' placeholder={t('account.reset_password.new_password')} onChange={(e) => {setPassword(e.target.value)}}></input>
                    </div>
                    <div className='field'>
                        <p className='label'>{t('account.reset_password.retype_password')}</p>
                        <input className='input wide' type='password' autoComplete="password" name='password' placeholder={t('account.reset_password.new_password')} onChange={(e) => {setPassword2(e.target.value)}}></input>
                    </div>
                    <MainButton onClick={updatePassword}>{t('account.reset_password.reset')}</MainButton>
                </form>
            </div>
        </div>
    )
}