'use client'

import { sendPasswordResetEmail } from "@/app/api/auth"
import MainButton from "@/components/Buttons/MainButton"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ResetPage() {
    const [email, setEmail] = useState("")
    const router = useRouter()
    
    const resetPassword = () => {
        sendPasswordResetEmail(email).then((data) => {
            router.push("/")
        })
    }
    
    return (
        <div className="popup_page">
            <div className="centered_content small popup">
                <h2>Reset Password</h2>
                <form>
                    <div className='field'>
                        <p className='label'>Email</p>
                        <input className='input wide' type='text' autoComplete="email" name='email' placeholder='crazycowmm@gmail.com' onChange={(e) => {setEmail(e.target.value)}}></input>
                    </div>
                    <MainButton onClick={resetPassword}>Send Reset Email</MainButton>
                </form>
            </div>
        </div>
    )
}