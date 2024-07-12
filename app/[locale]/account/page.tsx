'use client'

import { useEffect, useState } from "react"
import { IUser } from "../../api/types"
import { useRouter } from "next/navigation"
import { X } from "react-feather"
import { deleteUser, getUser } from "@/app/api/auth"
import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage"
import PopupComponent, { Popup } from "@/components/Popup/Popup";
import FormComponent, { FormElement } from "@/components/Form/Form";
import SecondaryButton from "@/components/Buttons/SecondaryButton"
import WarningButton from "@/components/Buttons/WarningButton"
import Text from "@/components/FormInputs/Text"
import { useI18n } from "@/locales/client"

export default function AccountPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [triedDeleteAccount, setTriedDeleteAccount] = useState(false)
    const [user, setUser] = useState({} as IUser)
    const router = useRouter();
    const t = useI18n();
    let token: string | null;

    useEffect(() => {
        const getData = async () => {
            token = sessionStorage.getItem('jwt')
            if(token) {
                let user = await getUser(undefined, token)
                if(user) {
                    setUser(user);
                }
            } else {
                router.push('/signin')
            }
        }
        getData();
    }, [])

    const updateHandle = (inputs: string[]) => {
        token = sessionStorage.getItem('jwt')
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
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('account.popup.handle_updated') + inputs[0], () => {
                    setUser({_id: user._id, username: user.username, handle: inputs[0], email: user.email, type: user.type})
                })) 
            })
        }).catch(e => {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('account.popup.error'))) 
            console.log(e)
        })
    }

    const updateUsername = (inputs: string[]) => {
        token = sessionStorage.getItem('jwt')
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
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('account.popup.username_updated') + inputs[0], () => {
                    setUser({_id: user._id, username: inputs[0], handle: user.handle, email: user.email, type: user.type})
                })) 
            })
        }).catch(e => {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('account.popup.error'))) 
            console.log(e)
        })
    }

    const updateEmail = (inputs: string[]) => {
        token = sessionStorage.getItem('jwt')
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
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('account.popup.email_updated') + inputs[0], () => {
                    setUser({_id: user._id, username: user.username, handle: user.handle, email: inputs[0]!, type: user.type})
                })) 
            })
        }).catch(e => {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('account.popup.error'))) 
        })
    }

    const updatePassword = (inputs: string[]) => {
        if(inputs[0] === inputs[1] && inputs[0]) {
            token = sessionStorage.getItem('jwt')
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
                    PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('account.popup.password_updated')))
                })
            })
        } else {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('account.popup.passwords_not_match')))
        }
        
    }

    const deleteAccount = () => {
        token = sessionStorage.getItem('jwt')
        if(!triedDeleteAccount) {
            setTriedDeleteAccount(true)
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Warning, t('account.popup.delete_account_warning'))) 
        } else if(!token) {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('account.popup.delete_account_auth_error'))) 
        } else {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('account.popup.delete_account_success')))
            deleteUser(token!)
            router.push("/")
        }
    }

    return (
        <div className="popup_page">
            <div className="centered_content small">
                <h2>{t('account.settings')}</h2>
                <div className="settings_option">
                    <div className="text">
                        <h3>{t('account.username')}</h3>
                        <p>{user.username}</p>
                    </div>
                    <SecondaryButton onClick={() => {Popup.createPopup({content: <FormComponent id={"changeUsername"} onSave={updateUsername}>
                        <Text name={t('account.username')} placeholder={user.username} />
                    </FormComponent>, title: t('account.change_username')})}}>{t('account.change_username')}</SecondaryButton>
                </div>
                <div className="settings_option">
                    <div className="text">
                        <h3>{t('account.handle')}</h3>
                        <p>{user.handle}</p>
                    </div>
                    <SecondaryButton onClick={() => {Popup.createPopup({content: <FormComponent id={"changeHandle"} onSave={updateHandle}>
                        <Text name={t('account.handle')} placeholder={user.handle} />
                    </FormComponent>, title: t('account.change_handle')})}}>{t('account.change_handle')}</SecondaryButton>
                </div>
                    <div className="settings_option">
                    <div className="text">
                        <h3>{t('account.email')}</h3>
                        <p>{user.email}</p>
                    </div>
                    <SecondaryButton onClick={() => {Popup.createPopup({content: <FormComponent id={"changeEmail"} onSave={updateEmail}>
                        <Text name={t('account.email')} placeholder={user.email} />    
                    </FormComponent>, title: t('account.change_email')})}}>{t('account.change_email')}</SecondaryButton>
                </div>
                <div className="settings_option">
                    <div className="text">
                        <h3>{t('account.password')}</h3>   
                    </div>
                    <SecondaryButton onClick={() => {Popup.createPopup({content: <FormComponent id="changePassword" onSave={updatePassword}>
                        <Text name={t('account.password')} type="password" />
                        <Text name={t('account.confirm_password')} type="password" />    
                    </FormComponent>, title: t('account.change_password')})}}>{t('account.change_password')}</SecondaryButton>
                </div>
                <div className="settings_option">
                    <div className="text">
                        <h3>{t('account.delete_account')}</h3>
                    </div>
                    <WarningButton onClick={deleteAccount}>{t('account.delete_account')}</WarningButton>
                </div>
            </div>
        </div>
    )
}