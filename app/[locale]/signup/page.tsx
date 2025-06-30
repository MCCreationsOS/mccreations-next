'use client'
import { useRouter } from "next/navigation";
import { SiDiscord, SiFacebook, SiGithub, SiGoogle, SiMicrosoft } from '@icons-pack/react-simple-icons'
import { Link } from "@/app/api/navigation";
import { SortOptions, UserTypes } from "@/app/api/types";
import {useTranslations} from 'next-intl';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { useCreations } from "@/app/api/hooks/creations";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function SignUp() {
    const router = useRouter();
    const t = useTranslations()
    const form = useForm({
        defaultValues: {
            username: "",
            email: "",
            password: ""
        },
        onSubmit: async (data) => {
            await signUpWithEmail(data.value.username, data.value.email, data.value.password)
        }
    })

    const signUpWithEmail = (username: string, email: string, password: string) => {
        fetch(`${process.env.DATA_URL}/sign_up`, {
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
                    toast(data.error)
                    return;
                } else {
                    router.push("/signin")
                }
            }).catch(error => {
                if(res.status === 200) {
                    router.push('/signin')
                    return;
                } else {
                    toast(t('SignUp.error'))
                    return;
                }
            })
        }).catch(error => {
            toast(t('SignUp.error'))
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
        <div className="h-full relative">
        <SignUpBackground />
        <div className="m-auto w-full md:w-1/2 my-10 bg-secondary p-10 absolute top-0 left-1/2 -translate-x-1/2 border-2 border-black">
            <h2 className="text-2xl font-bold mb-2">{t('Account.Shared.providers')}</h2>
            <div className="flex flex-row flex-wrap gap-2 mb-5">
                <Button variant="secondary" className="bg-white/10 py-3 px-6 hover:bg-white/20" onClick={signUpWithGoogle}><SiGoogle /><span>{t('Account.Shared.Providers.google')}</span></Button>
                <Button variant="secondary" className="bg-white/10 py-3 px-6 hover:bg-white/20" onClick={signInWithDiscord}><SiDiscord /><span>{t('Account.Shared.Providers.discord')}</span></Button>
                <Button variant="secondary" className="bg-white/10 py-3 px-6 hover:bg-white/20" onClick={signUpWithGithub}><SiGithub /><span>{t('Account.Shared.Providers.github')}</span></Button>
                <Button variant="secondary" className="bg-white/10 py-3 px-6 hover:bg-white/20" onClick={signUpWithMicrosoft}><SiMicrosoft /><span>{t('Account.Shared.Providers.microsoft')}</span></Button>
            </div>
            <h2 className="text-2xl font-bold mb-2">{t('SignUp.title')}</h2>
            <form onSubmit={(e) => {e.preventDefault(); form.handleSubmit()}} className="flex flex-col gap-2">
                <form.Field name="username" children={(field) => (
                        <>
                            <Input type="text" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => {field.handleChange(e.target.value)}} placeholder="Username" />
                            {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                        </>
                    )}  validators={{
                        onChange: ({value}) => {
                            if(value.length < 3) {
                                return 'Username must be at least 3 characters long'
                            }
                            let regex = /[A-Za-z0-9_]*/g, m;
                            m = regex.exec(value)
                            if(!m || m[0] !== m.input) {
                                return 'Invalid characters'
                            }
                        },
                        onSubmit: ({value}) => {
                            if(value.length < 3) {
                                return 'Username must be at least 3 characters long'
                            }
                        }
                    }}/>
                <form.Field name="email" children={(field) => (
                    <>
                        <Input type="email" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => {field.handleChange(e.target.value)}} placeholder="Email" />
                        {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                    </>
                )}  validators={{
                    onChange: ({value}) => {
                        if(value.length < 3) {
                            return 'Email must be at least 3 characters long'
                        }
                        let regex = /[A-Za-z0-9_]*/g, m;
                        m = regex.exec(value)
                        if(!m || m[0] !== m.input) {
                            return 'Invalid characters'
                        }
                        if(!value.includes('@') || !value.includes('.')) {
                            return 'Invalid email'
                        }
                    },
                    onSubmit: ({value}) => {
                        if(value.length < 3) {
                            return 'Email must be at least 3 characters long'
                        }
                    }
                }}/>
                <form.Field name="password" children={(field) => (
                    <>
                        <Input type="password" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => {field.handleChange(e.target.value)}} placeholder="Password" />
                        {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                    </>
                )}  validators={{
                    onChange: ({value}) => {
                        let regex = /[0-9]/g;
                        let m = regex.exec(value)
                        if(!m) {
                            return 'Password must contain a number'
                        }
                        (!value) ?
                        'Password is required' :
                        value.length < 9 ?
                        'Password must be at least 9 characters long' :
                        undefined
                    },
                    onSubmit: ({value}) => {
                        if(value.length < 9) {
                            return 'Password must be at least 9 characters long'
                        }
                    }
                }}/>
                <Button><span>{t('SignIn.button')}</span></Button>
            </form>
            <div className="flex flex-row gap-4 mt-2">
                <Link className="text-sm hover:underline" href="/signup">{t('SignIn.no_account')}</Link>
                <Link className="text-sm hover:underline" href="/signin/reset" >{t('Account.Shared.forgot_password')}</Link>
                </div>
            </div>
        </div>
       
    )
}

function SignUpBackground() {
    const {creations} = useCreations({status: 2, contentType: "content", limit: 20, page: 0, sort: SortOptions.HighestDownloads})
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((index + 1) % creations.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [creations, index])
    
    return (
        <div className="w-full min-h-[700px] aspect-video relative">
            {creations.map((creation, i) => (
                <div key={i} className={`${index === i ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                    <Image key={i} src={creation.images[0]} alt={creation.title} fill className={`${index === i ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 object-cover blur-sm`} />
                    <div className="absolute bottom-0 left-0 bg-black/50 p-4">
                        <h1 className="text-white text-xl font-bold">{creation.title}</h1>
                        <p className="text-sm">By {creation.creators.map((creator) => creator.username).join(", ")}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}