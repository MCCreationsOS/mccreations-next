'use client'
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { SiDiscord, SiFacebook, SiGithub, SiGoogle, SiMicrosoft } from '@icons-pack/react-simple-icons'
import Link from "next/link";
import MapScroll from "@/components/ContentScrollBackground/MapScroll";
import { UserTypes } from "@/app/api/types";
import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage";
import MainButton from "@/components/Buttons/MainButton";
import PopupComponent from "@/components/Popup/Popup";
import { useI18n } from "@/locales/client";
import FormComponent from "@/components/Form/Form";
import Text from "@/components/FormInputs/Text";

export default function SignUp() {
    const router = useRouter();
    const t = useI18n();

    const signUpWithEmail = (inputs: string[]) => {
        let username = inputs[0]
        let email = inputs[1]
        let password = inputs[2]
        if(username.length < 3) {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('auth.sign_up.username_too_short')))
            return;
        }

        var regex = /[A-Za-z0-9_]*/g, m;
        m = regex.exec(username)
        console.log()
        if(!m || m[0] !== m.input) {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('auth.sign_up.username_invalid_characters')))
            return;
        }

        if(!(email.includes('@') && email.includes('.'))) {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('auth.sign_up.email_invalid')))
            return;
        }

        if(!password || password.length < 9) {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('auth.sign_up.password_too_short')))
            return;
        }

        regex = /[0-9]/g;
        m = regex.exec(password)
        if(!m) {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('auth.sign_up.password_no_number')))
            return;
        }

        fetch(`${process.env.DATA_URL}/auth/signUpWithEmail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                type: UserTypes.Account
            })
        }).then((res) => {
            res.json().then((data) => {
                if(data.error) {
                    PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, data.error))
                    return;
                } else {
                    router.push("/")
                }
            }).catch(error => {
                if(res.status === 200) {
                    router.push('/signin')
                    return;
                } else {
                    PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('auth.sign_up.error')))
                    return;
                }
            })
        }).catch(error => {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('auth.sign_up.error')))
            return;
        })
    }

    const signUpWithGoogle = () => {
        let googleParams = new URLSearchParams({
            client_id: "92325017566-5lilo6v3qr4csbpnm3uvlub20e8va8ho.apps.googleusercontent.com",
            redirect_uri: `https://mccreations.net/auth/oauth_handler?provider=google`,
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
        router.push("https://discord.com/api/oauth2/authorize?client_id=882869275063386153&response_type=code&redirect_uri=https%3A%2F%2Fmccreations.net%2Fauth%2Foauth_handler%3Fprovider%3Ddiscord&scope=identify+email")
    }

    return (
        <div className="popup_page">
            <Suspense>
                <MapScroll />
            </Suspense>
            <PopupComponent useBackground={false} canClose={false}>
                    <h2>{t('auth.sign_in.with')}</h2>
                    <div className="sign_in_providers">
                        <div className="provider" onClick={signUpWithGoogle}><SiGoogle />{t('auth.sign_in.with_google')}</div>
                        <div className="provider" onClick={signInWithDiscord}><SiDiscord />{t('auth.sign_in.with_discord')}</div>
                        <div className="provider" onClick={signUpWithGithub}><SiGithub />{t('auth.sign_in.with_github')}</div>
                        <div className="provider" onClick={signUpWithMicrosoft}><SiMicrosoft />{t('auth.sign_in.with_microsoft')}</div>
                    </div>
                    <h2>{t('auth.sign_up.title')}</h2>
                    <FormComponent id="signUpForm" onSave={signUpWithEmail} options={{saveButtonContent: t('auth.sign_up')}}>
                        <Text type="text" placeholder={t('account.username_placeholder')} name={t('account.username')}/>
                        <Text type="email" placeholder={t('account.email_placeholder')} name={t('account.email')}/>
                        <Text type="password" placeholder={"password"} name={t('account.password')}/>
                    </FormComponent>
                    {/* <form method="">
                        <div className='field'>
                            <p className='label'>{t('account.username')}</p>
                            <input className='input wide' type='text' autoComplete="username" name='username' placeholder={t('account.username_placeholder')} onChange={(e) => {
                                console.log(e.target.value);
                                setUsername(e.currentTarget.value)
                            }}></input>
                        </div>
                        <div className='field'>
                            <p className='label'>{t('account.email')}</p>
                            <input className='input wide' type='text' autoComplete="email" name='email' placeholder={t('account.email_placeholder')} onChange={(e) => {setEmail(e.currentTarget.value)}}></input>
                        </div>
                        <div className='field'>
                            <p className='label'>{t('account.password')}</p>
                            <input className='input wide' type='password' autoComplete="password" name='password' placeholder='password' onChange={(e) => {setPassword(e.currentTarget.value)}}></input>
                        </div>
                        <MainButton onClick={signUpWithEmail}>{t('auth.sign_up')}</MainButton>
                    </form> */}
                    <div className="sign_up_options">
                        <Link href="/signin">{t('auth.already_have_account')}</Link>
                        <Link href="/signin/reset" >{t('auth.forgot_password')}</Link>
                    </div>
            </PopupComponent>
        </div>
       
    )
}