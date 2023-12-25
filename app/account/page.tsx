'use client'

import { useEffect, useState } from "react"
import { IUser } from "../types"
import { useRouter } from "next/navigation"
import { X } from "react-feather"
import { deleteUser, getUser } from "../api/auth"
import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage"
import PopupFormComponent, { PopupForm } from "@/components/PopupForm/PopupForm"

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
        

    const saveUser = () => {
        token = sessionStorage.getItem('jwt')
        if(PopupForm.inputs[0].value && PopupForm.inputs[0].value != user.handle && PopupForm.title === "Change Handle") {
            fetch(`${process.env.DATA_URL}/auth/user/updateHandle`, {
                method: 'POST',
                headers: {
                    authorization: token!,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({handle: PopupForm.inputs[0].value})
            }).then((res) => {
                res.json().then(data => {
                    PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, data.error)) 
                }).catch(e => {
                    PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, "Handle successfully updated to " + PopupForm.inputs[0].value, () => {
                        setUser({_id: user._id, username: user.username, handle: PopupForm.inputs[0].value, email: user.email, type: user.type})
                    })) 
                })
            }).catch(e => {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, "There was an error")) 
                console.log(e)
            })
        }
        if(PopupForm.inputs[0].value && PopupForm.inputs[0].value != user.email && PopupForm.title === "Change Email") {
            fetch(`${process.env.DATA_URL}/auth/user/updateEmail`, {
                method: 'POST',
                headers: {
                    authorization: token!,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: PopupForm.inputs[0].value})
            }).then((res) => {
                res.json().then(data => {
                    PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, data.error)) 
                }).catch(e => {
                    PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, "Email successfully updated to " + PopupForm.inputs[0].value, () => {
                        setUser({_id: user._id, username: user.username, handle: user.handle, email: PopupForm.inputs[0].value!, type: user.type})
                    })) 
                })
            }).catch(e => {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, "There was an error")) 
            })
        }
        if(PopupForm.inputs[0].value && PopupForm.inputs[1].value && PopupForm.inputs[0].value === PopupForm.inputs[1].value && PopupForm.title === "Change Password") {
            fetch(`${process.env.DATA_URL}/auth/user/updatePassword`, {
                method: 'POST',
                headers: {
                    authorization: token!,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({password: PopupForm.inputs[0].value})
            }).then((res) => {
                res.json().then(data => {
                    PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, data.error)) 
                }).catch(e => {
                    PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, "Password successfully updated"))
                })
            })
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
                    <button className="secondary_button" onClick={() => {PopupForm.openForm("Change Handle", [{type: 'text', name: 'Handle', placeholder: ""}], saveUser)}}>Change Handle</button>
                </div>
                    <div className="settings_option">
                    <div className="text">
                        <h3>Email</h3>
                        <p>{user.email}</p>
                    </div>
                    <button className="secondary_button" onClick={() => {PopupForm.openForm("Change Email", [{type: 'text', name: 'Email', placeholder: ""}], saveUser)}}>Change Email</button>
                </div>
                <div className="settings_option">
                    <div className="text">
                        <h3>Password</h3>   
                    </div>
                    <button className="secondary_button" onClick={() => {PopupForm.openForm("Change Password", [{type: 'password', name: 'New Password', placeholder: ""}, {type: 'password', name: 'Retype Password', placeholder: ""}], saveUser)}}>Change Password</button>
                </div>
                <div className="settings_option">
                    <div className="text">
                        <h3>Delete Account</h3>
                    </div>
                    <button className="red_button" onClick={deleteAccount}>Delete Account</button>
                </div>
            </div>
            <PopupFormComponent></PopupFormComponent>
        </div>
    )
}