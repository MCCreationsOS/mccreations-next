'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteUser } from "@/app/api/auth"
import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage"
import { Popup } from "@/components/Popup/Popup";
import FormComponent from "@/components/Form/Form";
import SecondaryButton from "@/components/Buttons/SecondaryButton"
import WarningButton from "@/components/Buttons/WarningButton"
import Text from "@/components/FormInputs/Text"
import {useTranslations} from 'next-intl';
import styles from "../AccountSidebar.module.css"
import { useToken, useUser } from "@/app/api/hooks/users"
import { UserTypes } from "@/app/api/types"

export default function AccountPage() {
    const [triedDeleteAccount, setTriedDeleteAccount] = useState(false)
    const {user, setUser, isLoading, error} = useUser(true)
    const router = useRouter();
    const t = useTranslations()
    const {token} = useToken()

    if(error) return <div className="centered_content">{t('Account.PopupMessage.error')}</div>
    if(isLoading) return <div className="centered_content">{t('Account.PopupMessage.loading')}</div>
    if(!user) {
        router.push("/signin?redirect=settings/account")
        return
    }

    const updateHandle = (inputs: string[]) => {
        fetch(`${process.env.DATA_URL}/user/updateHandle`, {
            method: 'POST',
            headers: {
                authorization: token!,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({handle: inputs[0]})
        }).then((res) => {
            res.json().then(data => {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, data.error)) 
            }).catch(e => {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Account.PopupMessage.handle_updated', {handle: inputs[0]}))) 
                setUser({...user, handle: inputs[0]})
                localStorage?.setItem('user', JSON.stringify({...user, handle: inputs[0]}))
            })
        }).catch(e => {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Account.PopupMessage.error'))) 
            console.log(e)
        })
    }

    const updateUsername = (inputs: string[]) => {
        fetch(`${process.env.DATA_URL}/user/updateProfile`, {
            method: 'POST',
            headers: {
                authorization: token!,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: inputs[0]})
        }).then((res) => {
            res.json().then(data => {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, data.error)) 
            }).catch(e => {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Account.PopupMessage.username_updated', {username: inputs[0]}))) 
                setUser({...user, username: inputs[0]})
                localStorage?.setItem('user', JSON.stringify({...user, username: inputs[0]}))
            })
        }).catch(e => {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Account.PopupMessage.error'))) 
            console.log(e)
        })
    }

    const updateEmail = (inputs: string[]) => {
        fetch(`${process.env.DATA_URL}/user/updateEmail`, {
            method: 'POST',
            headers: {
                authorization: token!,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: inputs[0]})
        }).then((res) => {
            res.json().then(data => {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, data.error)) 
            }).catch(e => {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Account.PopupMessage.email_updated', {email: inputs[0]}))) 
                setUser({...user, email: inputs[0]})
                localStorage?.setItem('user', JSON.stringify({...user, email: inputs[0]}))
            })
        }).catch(e => {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Account.PopupMessage.error'))) 
        })
    }

    const updatePassword = (inputs: string[]) => {
        if(inputs[0] === inputs[1] && inputs[0]) {
            fetch(`${process.env.DATA_URL}/user/updatePassword`, {
                method: 'POST',
                headers: {
                    authorization: token!,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({password: inputs[0]})
            }).then((res) => {
                res.json().then(data => {
                    PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, data.error)) 
                }).catch(e => {
                    PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Account.PopupMessage.password_updated')))
                })
            })
        } else {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Account.PopupMessage.passwords_not_match')))
        }
        
    }

    const deleteAccount = () => {
        if(!triedDeleteAccount) {
            setTriedDeleteAccount(true)
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Warning, t('Account.PopupMessage.delete_account_warning'))) 
        } else if(!token) {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Account.PopupMessage.delete_account_auth_error'))) 
        } else {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Account.PopupMessage.delete_account_success')))
            deleteUser(token!)
            setUser({_id: "", username: "", email: "", type: UserTypes.Account })
            router.push("/")
        }
    }

    return (
        <div className="popup_page">
            <div className={styles.account_content}>
                <h2>{t('Account.settings')}</h2>
                <div className="settings_option">
                    <div className="text">
                        <h3>{t('Account.Shared.username')}</h3>
                        <p>{user.username}</p>
                    </div>
                    <SecondaryButton onClick={() => {Popup.createPopup({content: <FormComponent id={"changeUsername"} onSave={updateUsername}>
                        <Text name={t('Account.Popup.new_username')} placeholder={user.username} />
                    </FormComponent>, title: t('Account.Popup.change_username')})}}>{t('Account.Popup.change_username')}</SecondaryButton>
                </div>
                <div className="settings_option">
                    <div className="text">
                        <h3>{t('Account.Shared.handle')}</h3>
                        <p>{user.handle}</p>
                    </div>
                    <SecondaryButton onClick={() => {Popup.createPopup({content: <FormComponent id={"changeHandle"} onSave={updateHandle}>
                        <Text name={t('Account.Popup.new_handle')} placeholder={user.handle} />
                    </FormComponent>, title: t('Account.Popup.change_handle')})}}>{t('Account.Popup.change_handle')}</SecondaryButton>
                </div>
                    <div className="settings_option">
                    <div className="text">
                        <h3>{t('Account.Shared.email')}</h3>
                        <p>{user.email}</p>
                    </div>
                    <SecondaryButton onClick={() => {Popup.createPopup({content: <FormComponent id={"changeEmail"} onSave={updateEmail}>
                        <Text name={t('Account.Popup.new_email')} placeholder={user.email} />    
                    </FormComponent>, title: t('Account.Popup.change_email')})}}>{t('Account.Popup.change_email')}</SecondaryButton>
                </div>
                <div className="settings_option">
                    <div className="text">
                        <h3>{t('Account.Shared.password')}</h3>   
                    </div>
                    <SecondaryButton onClick={() => {Popup.createPopup({content: <FormComponent id="changePassword" onSave={updatePassword}>
                        <Text name={t('Account.Popup.new_password')} type="password" />
                        <Text name={t('Account.Popup.confirm_password')} type="password" />    
                    </FormComponent>, title: t('Account.Popup.change_password')})}}>{t('Account.Popup.change_password')}</SecondaryButton>
                </div>
                <div className="settings_option">
                    <div className="text">
                        <h3>{t('Account.delete_account')}</h3>
                    </div>
                    <WarningButton onClick={deleteAccount}>{t('Account.delete_account')}</WarningButton>
                </div>
            </div>
        </div>
    )
}