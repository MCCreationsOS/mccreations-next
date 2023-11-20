'use client'

import { useEffect, useState } from "react"
import { IUser } from "../types"
import { auth } from "../auth/firebase"
import { useRouter } from "next/navigation"
import { X } from "react-feather"
import { deleteUser, sendEmailVerification, updateEmail, updatePassword, updateProfile } from "firebase/auth"

export default function AccountPage() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [formOpen, setFormOpen] = useState(0)
    const [triedDeleteAccount, setTriedDeleteAccount] = useState(false)
    const [user, setUser] = useState({} as IUser)
    const router = useRouter();

    useEffect(() => {
        auth.onAuthStateChanged((authUser) => {
            if(authUser) {
                let formatUser = {
                    uid: authUser.uid
                } as IUser
    
                if(authUser.displayName) {
                    formatUser.displayName = authUser.displayName;
                }
                if(authUser.email) {
                    formatUser.email = authUser.email;
                }
                if(authUser.photoURL) {
                    formatUser.photoUrl = authUser.photoURL;
                }
    
                if(formatUser != user) {
                    setUser(formatUser)
                }
            } else {
                router.push("/")
            }
        })
    }, [])
        

    const saveUser = () => {
        if(username.length > 1 && username != user.displayName) {
            updateProfile(auth.currentUser!, {
                displayName: username
            }).then(() => {
                setUser({uid: user.uid, displayName: username, email: user.email})
                setUsername("");
            })
        }
        if(email.length > 1 && email != user.email) {
            updateEmail(auth.currentUser!, email).then(() => {
                sendEmailVerification(auth.currentUser!);
                setUser({uid: user.uid, displayName: user.displayName, email: email})
                setEmail("");
            })
        }
        if(password.length > 1 && password === password2) {
            updatePassword(auth.currentUser!, password).catch(e => {
                router.push("/signin")
            })
        }
        setFormOpen(0);
        router.refresh();
    }

    const deleteAccount = () => {
        if(!triedDeleteAccount) {
            setTriedDeleteAccount(true)
        } else {
            deleteUser(auth.currentUser!).catch(e => {
                router.push("/signin")
            })
        }
    }


    return (
        <div className="popup_page">
            <div className="centered_content small" style={{filter: (formOpen > 0) ? "blur(2px)": "none"}}>
                <h2>Account Settings</h2>
                <div className="settings_option">
                    <div className="text">
                        <h3>Username</h3>
                        <p>{user.displayName}</p>
                    </div>
                    <button className="secondary_button" onClick={() => {setFormOpen(1)}}>Change Username</button>
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
                    <h3 className='label title'>{(formOpen == 1) ? "Change Username" : (formOpen == 2) ? "Change Email" : "Update Password"}</h3>
                    <div className="close" onClick={() => {setFormOpen(0)}}><X /></div>
                </div>
                <form>
                    <div className='field'>
                        <h4 className='label'>{(formOpen == 1) ? "Username" : (formOpen == 2) ? "Email" : "Password"}</h4>
                        <input className='input wide' type='text' name='data' onChange={(e) => {
                            if(formOpen == 1) {
                                setUsername(e.target.value)
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