'use client'
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { SiDiscord, SiGithub, SiGoogle, SiMicrosoft } from "@icons-pack/react-simple-icons";
import Link from "next/link";
import MapScroll from "@/components/MapScroll";
import { UserTypes } from "../types";
import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const signInWithEmail = () => {
        fetch(`${process.env.DATA_URL}/auth/signInWithEmail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    type: UserTypes.Account
                })
            }).then(res => {
                res.json().then(data => {
                    if(data.token) {
                        sessionStorage.setItem('jwt', data.token);
                        sessionStorage.setItem('creator', JSON.stringify(data.creator))
                        router.push('/')
                    } else {
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, data.error))
                        return;
                    }
                }).catch(e => {
                    PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, "There was an error signing you in"))
                    return;
                })
            }).catch(error => {
                console.log(error)
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, "There was an error communicating with our API"))
                return;
            })
    }

    const signUpWithGoogle = () => {
        let googleParams = new URLSearchParams({
            client_id: "92325017566-5lilo6v3qr4csbpnm3uvlub20e8va8ho.apps.googleusercontent.com",
            redirect_uri: "https://next.mccreations.net/auth/oauth_handler?provider=google",
            response_type: "token",
            scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
            state: "ILikeBigMoosAndICannotLie"
        })
        router.push("https://accounts.google.com/o/oauth2/v2/auth?" + googleParams.toString())
    }

    const signUpWithGithub = () => {
        router.push("https://github.com/login/oauth/authorize?client_id=d8fb2f8d7b4f8f88c320&scope=user:email,read:user")
    }

    const signUpWithMicrosoft = () => {
        let microsoftParams = new URLSearchParams({
            client_id: "f4c0f386-febc-4e8e-b0d5-20a99b4d0667",
            response_type: "code",
            redirect_uri: "https://next.mccreations.net/auth/oauth_handler",
            scope: "openid email profile",
            response_mode: "query",
            state: "ShoutoutToMyBoyMicrosoft"
        })
        router.push("https://login.microsoftonline.com/common/oauth2/v2.0/authorize?" + microsoftParams.toString())
    }

    const signInWithDiscord = () => {
        router.push("https://discord.com/api/oauth2/authorize?client_id=882869275063386153&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Foauth_handler%3Fprovider%3Ddiscord&scope=identify+email")
    }

    return (
        <div className="popup_page">
            {/* <Suspense>
                <MapScroll />
            </Suspense> */}
        <div className="centered_content small popup">
            {(message) ? <div className="errorBox"><p>{message}</p></div>: <></>}
            <h2>Sign In With...</h2>
            <div className="sign_in_providers">
                <div className="provider" onClick={signUpWithGoogle}><SiGoogle /> Google</div>
                <div className="provider" onClick={signInWithDiscord}><SiDiscord />Discord</div>
                <div className="provider" onClick={signUpWithGithub}><SiGithub />Github</div>
                <div className="provider" onClick={signUpWithMicrosoft}><SiMicrosoft />Microsoft</div>
            </div>
            <h2>Sign In With Email</h2>
            <form method="">
                <div className='field'>
                    <p className='label'>Email</p>
                    <input className='input wide' type='text' autoComplete="email" name='email' placeholder='crazycowmm@gmail.com' onChange={(e) => {setEmail(e.target.value)}}></input>
                </div>
                <div className='field'>
                    <p className='label'>Password</p>
                    <input className='input wide' type='password' autoComplete="password" name='password' placeholder='password' onChange={(e) => {setPassword(e.target.value)}}></input>
                </div>
                <button type="button" className="main_button" onClick={signInWithEmail}>Sign in</button>
            </form>
            <div className="sign_up_options">
                <Link href="/signup">Don't have an account?</Link>
                <Link href="/signin/reset" >Forgot your password?</Link>
            </div>
        </div>
        </div>
    )
}