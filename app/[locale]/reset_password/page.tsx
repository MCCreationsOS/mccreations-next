'use client'
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { resetPassword } from "@/app/api/auth";
import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage";
import MainButton from "@/components/Buttons/MainButton";
import {useTranslations} from 'next-intl';
import PopupComponent from "@/components/Popup/Popup";
import FormComponent from "@/components/Form/Form";
import Text from "@/components/FormInputs/Text";

export default function Page() {
    const params = useSearchParams()
    const router = useRouter();
    const t = useTranslations()

    let token: string | null
    
    token = params.get('token')
    if(!token) {
        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Warning, t('ResetPassword.token_error'), () => {
            router.back()
        }))
        return;
    }

    const updatePassword = async (inputs: string[]) => {
        const password = inputs[0]
        const password2 = inputs[1]
        token = params.get('token')
        if(!token) {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Warning, t('ResetPassword.token_error'), () => {
                router.back()
            }))
            return;
        }
        if(password === password2) {
            if(!password || password.length < 9) {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('ResetPassword.password_length')))
                return;
            }
    
            let regex = /[0-9]/g, m;
            m = regex.exec(password)
            if(!m) {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('ResetPassword.password_number')))
                return;
            }

            let error = await resetPassword(token!, password)
            if(error) {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, error))
            }
            router.push("/signin")
        } else {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('ResetPassword.passwords_not_same')))
            return;
        }
    }

    return (
        <div className="popup_page">
            <PopupComponent>
                <h2>{t('ResetPassword.title')}</h2>
                <FormComponent id="reset_password_form" onSave={updatePassword} options={{saveButtonContent: t('ResetPassword.reset')}}>
                    <Text type="password" name={t('ResetPassword.new_password')}></Text>
                    <Text type="password" name={t('ResetPassword.retype_password')}></Text>
                </FormComponent>
            </PopupComponent>
        </div>
        // <div className="popup_page">
        //     <div className="centered_content small popup">
        //         <h2>{t('ResetPassword.title')}</h2>
        //         <form>
        //             <div className='field'>
        //                 <p className='label'>{t('ResetPassword.new_password')}</p>
        //                 <input className='input wide' type='password' autoComplete="password" name='password' placeholder={t('ResetPassword.new_password')} onChange={(e) => {setPassword(e.target.value)}}></input>
        //             </div>
        //             <div className='field'>
        //                 <p className='label'>{t('ResetPassword.retype_password')}</p>
        //                 <input className='input wide' type='password' autoComplete="password" name='password' placeholder={t('ResetPassword.new_password')} onChange={(e) => {setPassword2(e.target.value)}}></input>
        //             </div>
        //             <MainButton onClick={updatePassword}>{t('ResetPassword.reset')}</MainButton>
        //         </form>
        //     </div>
        // </div>
    )
}