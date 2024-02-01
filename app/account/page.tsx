'use client'

import { useEffect, useState } from "react"
import { IUser } from "../types"
import { useRouter } from "next/navigation"
import { X } from "react-feather"
import { deleteUser, getUser } from "../api/auth"
import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage"
import PopupComponent, { Popup } from "@/components/Popup/Popup";
import FormComponent, { IFormInput } from "@/components/Form/Form";

export default function AccountPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [triedDeleteAccount, setTriedDeleteAccount] = useState(false)
    const [user, setUser] = useState({} as IUser)
    const router = useRouter();
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

    const updateHandle = (inputs: IFormInput[]) => {
        token = sessionStorage.getItem('jwt')
        fetch(`${process.env.DATA_URL}/auth/user/updateHandle`, {
            method: 'POST',
            headers: {
                authorization: token!,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({handle: inputs[0].value})
        }).then((res) => {
            res.json().then(data => {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, data.error)) 
            }).catch(e => {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, "Handle successfully updated to " + inputs[0].value, () => {
                    setUser({_id: user._id, username: user.username, handle: inputs[0].value, email: user.email, type: user.type})
                })) 
            })
        }).catch(e => {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, "There was an error")) 
            console.log(e)
        })
    }

    const updateEmail = (inputs: IFormInput[]) => {
        token = sessionStorage.getItem('jwt')
        fetch(`${process.env.DATA_URL}/auth/user/updateEmail`, {
            method: 'POST',
            headers: {
                authorization: token!,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: inputs[0].value})
        }).then((res) => {
            res.json().then(data => {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, data.error)) 
            }).catch(e => {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, "Email successfully updated to " + inputs[0].value, () => {
                    setUser({_id: user._id, username: user.username, handle: user.handle, email: inputs[0].value!, type: user.type})
                })) 
            })
        }).catch(e => {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, "There was an error")) 
        })
    }

    const updatePassword = (inputs: IFormInput[]) => {
        if(inputs[0].value === inputs[1].value && inputs[0].value) {
            token = sessionStorage.getItem('jwt')
            fetch(`${process.env.DATA_URL}/auth/user/updatePassword`, {
                method: 'POST',
                headers: {
                    authorization: token!,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({password: inputs[0].value})
            }).then((res) => {
                res.json().then(data => {
                    PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, data.error)) 
                }).catch(e => {
                    PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, "Password successfully updated"))
                })
            })
        } else {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, "Passwords do not match!"))
        }
        
    }

    const deleteAccount = () => {
        token = sessionStorage.getItem('jwt')
        if(!triedDeleteAccount) {
            setTriedDeleteAccount(true)
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Warning, "Click again to delete your account. This is permanent!")) 
        } else if(!token) {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, "Authorization Error. Please sign in again")) 
        } else {
            deleteUser(token!)
            router.push("/")
        }
    }

    return (
        <div className="popup_page">
            <div className="centered_content small">
                <h2>Account Settings</h2>
                <div className="settings_option">
                    <div className="text">
                        <h3>Handle</h3>
                        <p>{user.handle}</p>
                    </div>
                    <button className="secondary_button" onClick={() => {Popup.createPopup(<FormComponent inputs={[{type: 'text', name: 'Handle', placeholder: ""}]} onSave={updateHandle} />, "Change Handle")}}>Change Handle</button>
                </div>
                    <div className="settings_option">
                    <div className="text">
                        <h3>Email</h3>
                        <p>{user.email}</p>
                    </div>
                    <button className="secondary_button" onClick={() => {Popup.createPopup(<FormComponent inputs={[{type: 'text', name: 'Email', placeholder: ""}]} onSave={updateEmail} />, "Change Email")}}>Change Email</button>
                </div>
                <div className="settings_option">
                    <div className="text">
                        <h3>Password</h3>   
                    </div>
                    <button className="secondary_button" onClick={() => {Popup.createPopup(<FormComponent inputs={[{type: 'password', name: 'New Password', placeholder: ""}, {type: 'password', name: 'Retype Password', placeholder: ""}]} onSave={updatePassword} />, "Update Password")}}>Change Password</button>
                </div>
                <div className="settings_option">
                    <div className="text">
                        <h3>Delete Account</h3>
                    </div>
                    <button className="red_button" onClick={deleteAccount}>Delete Account</button>
                </div>
            </div>
            <PopupComponent />
        </div>
    )
}