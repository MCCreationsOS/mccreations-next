'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import { IUser } from "@/app/types"
import Link from "next/link"
import { LogOut, Settings, Table, User } from "react-feather"
import { useRouter } from "next/navigation"
import { getUser } from "@/app/api/auth"
import HollowButton from "../Buttons/HollowButton"

export default function UserOptions() {
    const [user, setUser] = useState({} as IUser)
    const [showOptions, setShowOptions] = useState(false)
    const router = useRouter();

    useEffect(() => {
        const getData = async () => {
            let token = sessionStorage.getItem('jwt')
            if(token) {
                let user = await getUser(undefined, token)
                if(user) {
                    setUser(user);
                }
            }
        }
        getData();
    }, [])

    if(!user._id) {
        return (
            <div className="user_menu">
                <Link href="/signin"><HollowButton>Sign In</HollowButton></Link>
            </div>
        )
    }

    return (
        <div className="user_menu" onClick={() => {setShowOptions(!showOptions)}}>
            <Image className="icon" src={(user.iconURL) ? user.iconURL : "/defaultLogo.png"} alt="User Icon" width={40} height={40} />
            <div className="options" style={{display: (showOptions) ? "block": "none"}}>
                <div className="option">
                    <p className="display_name">{user.username}</p>
                    <p className="email">{user.email}</p>
                </div>
                <hr></hr>
                <div className="option icon" onClick={() => {router.push("/creator/"+user.handle)}}>
                    <User />Profile
                </div>
                <div className="option icon" onClick={() => {router.push("/dashboard")}}>
                    <Table />Dashboard
                </div>
                <div className="option icon" onClick={() => {router.push("/account")}}>
                    <Settings />Settings
                </div>
                <div className="option icon" onClick={() => {sessionStorage.clear(); location.reload()}}>
                    <LogOut />Sign Out
                </div>
            </div>
        </div>
    )
}