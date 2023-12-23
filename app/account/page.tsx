'use client'

import { useEffect, useState } from "react"
import { IUser } from "../types"
import { useRouter } from "next/navigation"
import { X } from "react-feather"
import { deleteUser, getUser } from "../api/auth"

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
                    console.log(user)
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
                    authorization: token!
                }
            }).then(() => {
                setUser({_id: user._id, username: user.username, handle: handle, email: user.email, type: user.type})
                setHandle("");
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
            console.log("setting password")
            fetch(`${process.env.DATA_URL}/auth/user/updatePassword`, {
                method: 'POST',
                headers: {
                    authorization: token!,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({password: password})
            }).then(() => {
                console.log("request sent")
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


    return (
        <div className="popup_page">
            <div className="centered_content small" style={{filter: (formOpen > 0) ? "blur(2px)": "none"}}>
                <h2>Account Settings</h2>
                <div className="settings_option">
                    <div className="text">
                        <h3>Handle</h3>
                        <p>{user.handle}</p>
                    </div>
                    <button className="secondary_button" onClick={() => {setFormOpen(1)}}>Change Handle</button>
                </div>
                    <div className="settings_option">
                    <div className="text">
                        <h3>Email</h3>
                        <p>{user.email}</p>
                    </div>
                    <button className="secondary_button" onClick={() => {setFormOpen(2)}}>Change Email</button>
                </div>
                <div className="settings_option">
                    <div className="text">
                        <h3>Password</h3>   
                    </div>
                    <button className="secondary_button" onClick={() => {setFormOpen(3)}}>Change Password</button>
                </div>
                <div className="settings_option">
                    <div className="text">
                        <h3>Delete Account</h3>
                    </div>
                    <button className="red_button" onClick={deleteAccount}>Delete Account</button>
                </div>
            </div>
            <div className="popup_background" style={{display: (formOpen > 0) ? "block": "none"}}></div>
            <div className="centered_content popup small" style={{display: (formOpen > 0) ? "block": "none"}}>
                <div className="titlebar">
                    <h3 className='label title'>{(formOpen == 1) ? "Change Handle" : (formOpen == 2) ? "Change Email" : "Update Password"}</h3>
                    <div className="close" onClick={() => {setFormOpen(0)}}><X /></div>
                </div>
                <form>
                    <div className='field'>
                        <h4 className='label'>{(formOpen == 1) ? "Handle" : (formOpen == 2) ? "Email" : "Password"}</h4>
                        <input className='input wide' type='text' name='data' onChange={(e) => {
                            if(formOpen == 1) {
                                setHandle(e.target.value)
                            } else if(formOpen == 2) {
                                setEmail(e.target.value)
                            } else {
                                setPassword(e.target.value)
                            }
                        }}></input>
                        {(formOpen == 3) ? <div className="field"><h4 className="label">Retype Password</h4><input className='input wide' type='text' name='data' onChange={(e) => {setPassword2(e.target.value)}}></input></div> : <></>}
                    </div>
                    <button type="button" className="main_button" onClick={saveUser}>Save</button>
                </form>
            </div>
        </div>
    )
}