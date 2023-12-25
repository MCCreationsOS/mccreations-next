'use client'

import { useEffect, useState } from "react"
import { IUser } from "../types"
import { useRouter } from "next/navigation"
import { X } from "react-feather"
import { deleteUser, getUser } from "../api/auth"
import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage"
import PopupFormComponent, { PopupForm } from "@/components/PopupForm/PopupForm"

export default function AccountPage() {
    const [handle, setHandle] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [formOpen, setFormOpen] = useState(0)
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
        if(handle.length > 1 && handle != user.handle) {
            fetch(`${process.env.DATA_URL}/auth/user/updateHandle`, {
                method: 'POST',
                headers: {
                    authorization: token!,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({handle: handle})
            }).then((res) => {
                res.json().then(data => {
                    PopupMessage.addMessage(new PopupMessage(PopupMessageType.Warning, data.error)) 
                }).catch(e => {
                    setUser({_id: user._id, username: user.username, handle: handle, email: user.email, type: user.type})
                    setHandle("");
                })
            }).catch(e => {
                console.log(e)
            })
        }
        if(email.length > 1 && email != user.email) {
            fetch(`${process.env.DATA_URL}/auth/user/updateEmail`, {
                method: 'POST',
                headers: {
                    authorization: token!,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: email})
            }).then(() => {
                // sendEmailVerification(auth.currentUser!);
                setUser({_id: user._id, username: user.username, handle: user.handle, email: email, type: user.type})
                setEmail("");
            })
        }
        if(password.length > 1 && password === password2) {
            fetch(`${process.env.DATA_URL}/auth/user/updatePassword`, {
                method: 'POST',
                headers: {
                    authorization: token!,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({password: password})
            }).then(() => {
            })
            setPassword("")
            setPassword2("")
        }
        setFormOpen(0);
    }

    const deleteAccount = () => {
        if(!triedDeleteAccount) {
            setTriedDeleteAccount(true)
        } else {
            deleteUser(token!)
        }
    }

    const handleChange = () => {

    }


    return (
        <div className="popup_page">
            <div className="centered_content small" style={{filter: (formOpen > 0) ? "blur(2px)": "none"}}>
                <h2>Account Settings</h2>
                <div className="settings_option">
                    <div className="text">
                        <h3>Handle</h3>
                        <p>{user.handle}</p>
                    </div>
                    <button className="secondary_button" onClick={() => {PopupForm.openForm("Change Handle", [{type: 'text', name: 'Handle', onChange: setHandle, placeholder: ""}], saveUser)}}>Change Handle</button>
                </div>
                    <div className="settings_option">
                    <div className="text">
                        <h3>Email</h3>
                        <p>{user.email}</p>
                    </div>
                    <button className="secondary_button" onClick={() => {PopupForm.openForm("Change Email", [{type: 'text', name: 'Email', onChange: setEmail, placeholder: ""}], saveUser)}}>Change Email</button>
                </div>
                <div className="settings_option">
                    <div className="text">
                        <h3>Password</h3>   
                    </div>
                    <button className="secondary_button" onClick={() => {PopupForm.openForm("Change Password", [{type: 'password', name: 'New Password', onChange: setPassword, placeholder: ""}, {type: 'password', name: 'Retype Password', onChange: setPassword2, placeholder: ""}], saveUser)}}>Change Password</button>
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