'use client'

import { useEffect, useState } from "react"
import { IUser } from "../../api/types"
import { useRouter } from "next/navigation"
import { X } from "react-feather"
import { deleteUser, getUser, useUserStore } from "@/app/api/auth"
import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage"
import PopupComponent, { Popup } from "@/components/Popup/Popup";
import FormComponent, { FormElement } from "@/components/Form/Form";
import SecondaryButton from "@/components/Buttons/SecondaryButton"
import WarningButton from "@/components/Buttons/WarningButton"
import Text from "@/components/FormInputs/Text"
import {useTranslations} from 'next-intl';

export default function AccountPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [triedDeleteAccount, setTriedDeleteAccount] = useState(false)
    const user = useUserStore() as IUser
    const setUser = useUserStore((state) => state.setUser)
    const router = useRouter();
    const t = useTranslations()
    let token: string | null;

    useEffect(() => {
        if(!user._id) {
            const storedUser = localStorage.getItem('user')
            if(storedUser) {
                let user = JSON.parse(storedUser) as IUser
                setUser(user)
            } else {
                getUser(localStorage.getItem('jwt') + "").then((user) => {
                    if(user) {
                        setUser(user)
                        localStorage.setItem('user', JSON.stringify(user))
                    } else {
                        localStorage.removeItem('jwt')
                        localStorage.removeItem('user')
                    }
                })
            }
        }
    }, [])

    const updateHandle = (inputs: string[]) => {
        token = localStorage.getItem('jwt')
        fetch(`${process.env.DATA_URL}/auth/user/updateHandle`, {
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
                localStorage.setItem('user', JSON.stringify({...user, handle: inputs[0]}))
            })
        }).catch(e => {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Account.PopupMessage.error'))) 
            console.log(e)
        })
    }

    const updateUsername = (inputs: string[]) => {
        token = localStorage.getItem('jwt')
        fetch(`${process.env.DATA_URL}/auth/user/updateProfile`, {
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
                localStorage.setItem('user', JSON.stringify({...user, username: inputs[0]}))
            })
        }).catch(e => {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Account.PopupMessage.error'))) 
            console.log(e)
        })
    }

    const updateEmail = (inputs: string[]) => {
        token = localStorage.getItem('jwt')
        fetch(`${process.env.DATA_URL}/auth/user/updateEmail`, {
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
                localStorage.setItem('user', JSON.stringify({...user, email: inputs[0]}))
            })
        }).catch(e => {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Account.PopupMessage.error'))) 
        })
    }

    const updatePassword = (inputs: string[]) => {
        if(inputs[0] === inputs[1] && inputs[0]) {
            token = localStorage.getItem('jwt')
            fetch(`${process.env.DATA_URL}/auth/user/updatePassword`, {
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
        token = localStorage.getItem('jwt')
        if(!triedDeleteAccount) {
            setTriedDeleteAccount(true)
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Warning, t('Account.PopupMessage.delete_account_warning'))) 
        } else if(!token) {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Account.PopupMessage.delete_account_auth_error'))) 
        } else {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Account.PopupMessage.delete_account_success')))
            deleteUser(token!)
            router.push("/")
        }
    }

    return (
        <div className="popup_page">
            <div className="centered_content small">
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