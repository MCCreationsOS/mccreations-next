'use client'

import { auth } from "@/app/auth/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { useState } from "react"
import Image from "next/image"
import { IUser } from "@/app/types"
import Link from "next/link"
import { LogOut } from "react-feather"

export default function UserOptions() {
    const [user, setUser] = useState({} as IUser)
    const [showOptions, setShowOptions] = useState(false)

    if(!user.uid) {
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
                setUser({});
            }
        })

        return (
            <div className="user_menu">
                <Link href="/signup">Sign Up</Link>
            </div>
        )
    }

    return (
        <div className="user_menu" onClick={() => {setShowOptions(!showOptions)}}>
            <Image className="icon" src={(user.photoUrl) ? user.photoUrl : "/defaultLogo.png"} alt="User Icon" width={40} height={40} />
            <div className="options" style={{display: (showOptions) ? "block": "none"}}>
                <div className="option">
                    <p className="display_name">{user.displayName}</p>
                    <p className="email">{user.email}</p>
                </div>
                <hr></hr>
                <div className="option icon" onClick={() => {signOut(auth)}}>
                    <LogOut />Sign Out
                </div>
            </div>
        </div>
    )
}