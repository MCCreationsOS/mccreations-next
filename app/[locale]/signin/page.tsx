'use client'
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { SiDiscord, SiGithub, SiGoogle, SiMicrosoft } from "@icons-pack/react-simple-icons";
import { Link } from "@/app/api/navigation";
import MapScroll from "@/components/ContentScrollBackground/MapScroll";
import { UserTypes } from "../../api/types";
import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage";
import MainButton from "@/components/Buttons/MainButton";
import { sendLog } from "@/app/api/logging";
import {useTranslations} from 'next-intl';
import { useUser, useToken } from "@/app/api/hooks/users";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const {setUser} = useUser(true)
    const {setToken} = useToken()
    const query = useSearchParams()
    const router = useRouter();
    const t = useTranslations()

    const signInWithEmail = () => {
        fetch(`${process.env.DATA_URL}/sign_in`, {
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
                    if(data.jwt) {
                        setUser(data.user)
                        setToken(data.jwt)
                        let redirect = query.get('redirect') ?? ''
                        if(redirect !== "null" && redirect !== "") {
                            router.push('/' + redirect)
                        } else {
                            router.push('/')
                        }
                    } else {
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, data.error))
                        return;
                    }
                }).catch(e => {
                    PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('SignIn.error')))
                    return;
                })
            }).catch(error => {
                sendLog("Sign in with email", error)
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('SignIn.error')))
                return;
            })
    }

    const signUpWithGoogle = () => {
        let googleParams = new URLSearchParams({
            client_id: "92325017566-5lilo6v3qr4csbpnm3uvlub20e8va8ho.apps.googleusercontent.com",
            redirect_uri: "https://mccreations.net/auth/oauth_handler?provider=google",
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
            redirect_uri: "https://mccreations.net/auth/oauth_handler",
            scope: "openid email profile",
            response_mode: "query",
            state: "ShoutoutToMyBoyMicrosoft"
        })
        router.push("https://login.microsoftonline.com/common/oauth2/v2.0/authorize?" + microsoftParams.toString())
    }

    const signInWithDiscord = () => {
        let discordParams = new URLSearchParams({
            client_id: "882869275063386153",
            redirect_uri: "https://mccreations.net/auth/oauth_handler?provider=discord",
            response_type: "code",
            scope: "identify email"
        })
        router.push("https://discord.com/api/oauth2/authorize?" + discordParams.toString())
    }

    return (
        <div className="popup_page">
            {/* <Suspense>
                <MapScroll />
            </Suspense> */}
        <div className="centered_content small popup">
            {(message) ? <div className="errorBox"><p>{message}</p></div>: <></>}
            <h2>{t('Account.Shared.providers')}</h2>
            <div className="sign_in_providers">
                <div className="provider" onClick={signUpWithGoogle}><SiGoogle />{t('Account.Shared.Providers.google')}</div>
                <div className="provider" onClick={signInWithDiscord}><SiDiscord />{t('Account.Shared.Providers.discord')}</div>
                <div className="provider" onClick={signUpWithGithub}><SiGithub />{t('Account.Shared.Providers.github')}</div>
                <div className="provider" onClick={signUpWithMicrosoft}><SiMicrosoft />{t('Account.Shared.Providers.microsoft')}</div>
            </div>
            <h2>{t('SignIn.email_title')}</h2>
            <form method="">
                <div className='field'>
                    <p className='label'>{t('Account.Shared.email')}</p>
                    <input className='input wide' type='text' autoComplete="email" name='email' placeholder={t('Account.Shared.email_placeholder')} onChange={(e) => {setEmail(e.target.value)}}></input>
                </div>
                <div className='field'>
                    <p className='label'>{t('Account.Shared.password')}</p>
                    <input className='input wide' type='password' autoComplete="password" name='password' placeholder='password' onChange={(e) => {setPassword(e.target.value)}} onKeyDown={(e) => {if(e.key === 'Enter') signInWithEmail()}}></input>
                </div>
                <MainButton onClick={signInWithEmail}>{t('SignIn.button')}</MainButton>
            </form>
            <div className="sign_up_options">
                <Link href="/signup">{t('SignIn.no_account')}</Link>
                <Link href="/signin/reset" >{t('Account.Shared.forgot_password')}</Link>
            </div>
        </div>
        </div>
    )
}