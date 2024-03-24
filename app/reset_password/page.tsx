'use client'
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { resetPassword } from "@/app/api/auth";
import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage";
import MainButton from "@/components/Buttons/MainButton";

export default function Page() {
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const params = useSearchParams()
    const router = useRouter();

    let token: string | null
    
    useEffect(() => {
        token = params.get('token')
        if(token) {

        } else {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Warning, "No token found, returning to previous page", () => {
                router.back()
            }))
            return;
        }
    }, [])

    const updatePassword = async () => {
        if(password === password2) {

            if(!password || password.length < 9) {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, "Password must be 10 or more characters"))
                return;
            }
    
            let regex = /[0-9]/g, m;
            m = regex.exec(password)
            if(!m) {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, "Password must include at least one number"))
                return;
            }

            let result = await resetPassword(token!, password)
            if(result) {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, result.error))
            }
            router.push("/signin")
        } else {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, "Passwords are not the same"))
            return;
        }
    }

    return (
        <div className="popup_page">
            <div className="centered_content small popup">
                <h2>Reset Password</h2>
                <form>
                    <div className='field'>
                        <p className='label'>New Password</p>
                        <input className='input wide' type='password' autoComplete="email" name='email' placeholder='password' onChange={(e) => {setPassword(e.target.value)}}></input>
                    </div>
                    <div className='field'>
                        <p className='label'>Retype Password</p>
                        <input className='input wide' type='password' autoComplete="email" name='email' placeholder='password' onChange={(e) => {setPassword2(e.target.value)}}></input>
                    </div>
                    <MainButton onClick={updatePassword}>Reset</MainButton>
                </form>
            </div>
        </div>
    )
}