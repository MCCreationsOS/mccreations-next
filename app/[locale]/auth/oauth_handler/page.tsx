'use client'

import { getUser } from "@/app/api/auth";
import { useToken, useUser } from "@/app/api/hooks/users";
import {useTranslations} from 'next-intl';
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

export default function OauthHandlerPage() {
    const {user, setUser} = useUser()
    const {token, setToken} = useToken()
    const params = useSearchParams()
    const router = useRouter();
    const t = useTranslations()

    function saveUser(data: any) {
        setToken(data.jwt)
        setUser(data.user)
    }

    function signInWithDiscord(code: string | null): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                fetch(`${process.env.DATA_URL}/sign_in`, {
                    'method': 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    'body': JSON.stringify({
                        'provider': 0,
                        'code': code
                    })
                }).then(res => {
                    res.json().then(data => {
                        if(data.error) {
                            reject(data.error)
                            return;
                        }
                        saveUser(data)
                        resolve(data)
                    })
                }).catch(error => {
                    reject(error)
                })
            } catch(error) {
                reject(error)
            }
        })
    }
    
    function addDiscordProvider(code: string | null): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                fetch(`${process.env.DATA_URL}/auth/user/addProvider?code=${code}`, {
                method: 'POST',
                headers: {
                    'Authorization': `${localStorage?.getItem('jwt')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    provider: 'discord'
                })
                }).then(res => {
                    res.json().then(data => {
                        if(data.error) {    
                            reject(data.error)
                            return;
                        }
                        resolve(data)
                    })
                }).catch(error => {
                    reject(error)
                })
            } catch(error) {
                reject(error)
            }
        })
    }
    
    function signInWithGithub(code: string | null): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                fetch(`${process.env.DATA_URL}/sign_in`, {
                    'method': 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    'body': JSON.stringify({
                        'provider': 3,
                        'code': code
                    })
                }).then(res => {
                    res.json().then(data => {
                        if(data.error) {
                            reject(data.error)
                            return;
                        }
                        saveUser(data)
                        resolve(data)
                    }).catch(error => reject(error))
                }).catch(error => reject(error))
            } catch(error) {
                reject(error)
            }
        })
    }
    
    function addGithubProvider(code: string | null): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                fetch(`${process.env.DATA_URL}/auth/user/addProvider?code=${code}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `${localStorage?.getItem('jwt')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        provider: 'github'
                    })
                }).then(res => {
                    res.json().then(data => {
                        if(data.error) {
                            reject(data.error)
                            return;
                        }
                        resolve(data)
                    }).catch(error => reject(error))
                }).catch(error => reject(error))
            } catch(error) {
                reject(error)
            }
        })
    }
    
    function signInWithGoogle(code: string | null): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                fetch(`${process.env.DATA_URL}/sign_in`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    'body': JSON.stringify({
                        'provider': 1,
                        'code': code
                    })
                }).then(res => {
                    res.json().then(data => {
                        if(data.error) {
                            reject(data.error)
                            return;
                        }
                        saveUser(data)
                        resolve(data)
                    }).catch(error => reject(error))
                }).catch(error => reject(error))
            } catch(error) {
                reject(error)
            }
        })
    }
    
    function addGoogleProvider(code: string | null): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                fetch(`${process.env.DATA_URL}/auth/user/addProvider?code=${code}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `${localStorage?.getItem('jwt')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        provider: 'google'
                    })
                }).then(res => {
                    res.json().then(data => {
                        if(data.error) {
                            reject(data.error)
                            return;
                        }
                        resolve(data)
                    }).catch(error => reject(error))
                }).catch(error => reject(error))
            } catch(error) {
                reject(error)
            }
        })
    }
    
    function signInWithMicrosoft(code: string | null): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                fetch(`${process.env.DATA_URL}/sign_in`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    'body': JSON.stringify({
                        'provider': 2,
                        'code': code
                    })
                }).then(res => {
                    res.json().then(data => {
                        if(data.error) {
                            reject(data.error)
                            return;
                        }
                        saveUser(data)
                        resolve(data)
                    }).catch(error => reject(error))
                }).catch(error => reject(error))
            } catch(error) {
                reject(error)
            }
        })
    }
    
    function addMicrosoftProvider(code: string | null): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                fetch(`${process.env.DATA_URL}/auth/user/addProvider?code=${code}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `${localStorage?.getItem('jwt')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        provider: 'microsoft'
                    })
                }).then(res => {
                    res.json().then(data => {
                        if(data.error) {
                            reject(data.error)
                            return;
                        }
                        resolve(data)
                    }).catch(error => reject(error))
                }).catch(error => reject(error))
            } catch(error) {
                reject(error)
            }
        })
    }

    let provider = params.get('provider')
    const handleSignIn = async () => {
        if(token) {
            let u = await getUser(token)
            if(u) {
                mutate(u)
            }
        }
        if(provider === "discord") {
            let code = params.get('code')
            if(!user || user._id === "") {
                signInWithDiscord(code).then(data => {
                    router.push('/')
                }).catch(error => {
                    toast.error(<>{t('Pages.Auth.OAuth_Handler.error')}</>)
                    router.push('/')
                });
            } else {
                addDiscordProvider(code).then(data => {
                    router.push('/')
                }).catch(error => {
                    toast.error(<>{t('Pages.Auth.OAuth_Handler.error')}</>)
                    router.push('/')
                });
            }
        } else if(provider === 'github') {
            let code = params.get('code')
            if(!user || user._id === "") {
                signInWithGithub(code + "").then(data => {
                    router.push('/')
                }).catch(error => {
                    toast.error(<>{t('Pages.Auth.OAuth_Handler.error')}</>)
                    router.push('/')
                });
            } else {
                addGithubProvider(code + "").then(data => {
                    router.push('/')
                }).catch(error => {
                    toast.error(<>{t('Pages.Auth.OAuth_Handler.error')}</>)
                    router.push('/')
                });
            }
        } else if(provider === 'google') {
            let hash = location.hash.substring(1);
            let params:any = {};
            var regex = /([^&=]+)=([^&]*)/g, m;
            while(m = regex.exec(hash)) {
                params[decodeURIComponent(m[1])] = decodeURIComponent(m[2])
            }
            if(Object.keys(params).length > 0 && params.state && params.state === "ILikeBigMoosAndICannotLie" && params.access_token) {
                if(!user || user._id === "") {
                    signInWithGoogle(params.access_token).then(data => {
                        router.push('/')
                    }).catch(error => {
                        toast.error(<>{t('Pages.Auth.OAuth_Handler.error')}</>)
                        router.push('/')
                    });
                } else {
                    addGoogleProvider(params.access_token).then(data => {
                        router.push('/')
                    }).catch(error => {
                        toast.error(<>{t('Pages.Auth.OAuth_Handler.error')}</>)
                        router.push('/')
                    });
                }
            } else {
                router.push("/signup")
            }
        } else if(params.get('state') === "ShoutoutToMyBoyMicrosoft") {
            let code = params.get('code')
            if(!user || user._id === "") {
                signInWithMicrosoft(code).then(data => {
                    router.push('/')
                }).catch(error => {
                    toast.error(<>{t('Pages.Auth.OAuth_Handler.error')}</>)
                    router.push('/')
                });
            } else {
                addMicrosoftProvider(code).then(data => {
                    router.push('/')
                }).catch(error => {
                    toast.error(<>{t('Pages.Auth.OAuth_Handler.error')}</>)
                    router.push('/')
                });
            }
        } else {
            router.push('/')
        }
    }
    useEffect(() => {
        handleSignIn()
    }, [])

    

    return (
        <>
            <div className="popup_page">
                <div className="popup centered_content small">
                    {t('Pages.Auth.OAuth_Handler.loading')}
                </div>
            </div>
        </>
    )
}