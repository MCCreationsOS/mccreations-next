'use client'

import { getUser, useUserStore } from "@/app/api/auth";
import { IUser } from "@/app/api/types";
import Menu from "@/components/Menu/Menu";
import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage";
import {useTranslations} from 'next-intl';
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

function signInWithDiscord(code: string | null, setUser: (user: IUser) => void): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            fetch(`${process.env.DATA_URL}/auth/signInWithDiscord?code=${code}`, {
                'method': 'POST'
            }).then(res => {
                res.json().then(data => {
                    if(data.error) {
                        reject(data.error)
                        return;
                    }
                    localStorage.setItem('jwt', data.token);
                    localStorage.setItem('user', JSON.stringify(data.creator))
                    setUser(data.creator)
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
                'Authorization': `${localStorage.getItem('jwt')}`,
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

function signInWithGithub(code: string | null, setUser: (user: IUser) => void): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            fetch(`${process.env.DATA_URL}/auth/signInWithGithub?code=${code}`, {
                'method': 'POST'
            }).then(res => {
                res.json().then(data => {
                    if(data.error) {
                        reject(data.error)
                        return;
                    }
                    localStorage.setItem('jwt', data.token);
                    localStorage.setItem('user', JSON.stringify(data.creator))
                    setUser(data.creator)
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
                    'Authorization': `${localStorage.getItem('jwt')}`,
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

function signInWithGoogle(code: string | null, setUser: (user: IUser) => void): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            fetch(`${process.env.DATA_URL}/auth/signInWithGoogle?access_token=${code}`, {
                method: 'POST'
            }).then(res => {
                res.json().then(data => {
                    if(data.error) {
                        reject(data.error)
                        return;
                    }
                    localStorage.setItem('jwt', data.token);
                    localStorage.setItem('user', JSON.stringify(data.creator))
                    setUser(data.creator)
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
                    'Authorization': `${localStorage.getItem('jwt')}`,
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

function signInWithMicrosoft(code: string | null, setUser: (user: IUser) => void): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            fetch(`${process.env.DATA_URL}/auth/signInWithMicrosoft?code=${code}`, {
                method: 'POST'
            }).then(res => {
                res.json().then(data => {
                    if(data.error) {
                        reject(data.error)
                        return;
                    }
                    localStorage.setItem('jwt', data.token);
                    localStorage.setItem('user', JSON.stringify(data.creator))
                    setUser(data.creator)
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
                    'Authorization': `${localStorage.getItem('jwt')}`,
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

export default function OauthHandlerPage() {
    const user = useUserStore()
    const setUser = useUserStore((state) => state.setUser)
    const params = useSearchParams()
    const router = useRouter();
    const t = useTranslations()

    useEffect(() => {
        let provider = params.get('provider')
        const handleSignIn = async () => {
            const token = localStorage.getItem('jwt')
            if(token) {
                let u = await getUser(token)
                if(u) {
                    setUser(u)
                }
            }
            if(provider === "discord") {
                let code = params.get('code')
                if(!user || user._id === "") {
                    signInWithDiscord(code, setUser).then(data => {
                        router.push('/')
                    }).catch(error => {
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Auth.OAuth.PopupMessage.error'), () => {
                            router.push('/')
                        }))
                    });
                } else {
                    addDiscordProvider(code).then(data => {
                        router.push('/')
                    }).catch(error => {
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Auth.OAuth.PopupMessage.error'), () => {
                            router.push('/')
                        }))
                    });
                }
            } else if(provider === 'github') {
                let code = params.get('code')
                if(!user || user._id === "") {
                    signInWithGithub(code + "", setUser).then(data => {
                        router.push('/')
                    }).catch(error => {
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Auth.OAuth.PopupMessage.error'), () => {
                            router.push("/")
                        }))
                    });
                } else {
                    addGithubProvider(code + "").then(data => {
                        router.push('/')
                    }).catch(error => {
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Auth.OAuth.PopupMessage.error'), () => {
                            router.push("/")
                        }))
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
                        signInWithGoogle(params.access_token, setUser).then(data => {
                            router.push('/')
                        }).catch(error => {
                            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Auth.OAuth.PopupMessage.error'), () => {
                                router.push("/")
                            }))
                        });
                    } else {
                        addGoogleProvider(params.access_token).then(data => {
                            router.push('/')
                        }).catch(error => {
                            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Auth.OAuth.PopupMessage.error'), () => {
                                router.push("/")
                            }))
                        });
                    }
                } else {
                    router.push("/signup")
                }
            } else if(params.get('state') === "ShoutoutToMyBoyMicrosoft") {
                let code = params.get('code')
                if(!user || user._id === "") {
                    signInWithMicrosoft(code, setUser).then(data => {
                        router.push('/')
                    }).catch(error => {
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Auth.OAuth.PopupMessage.error'), () => {
                            router.push("/")
                        }))
                    });
                } else {
                    addMicrosoftProvider(code).then(data => {
                        router.push('/')
                    }).catch(error => {
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Auth.OAuth.PopupMessage.error'), () => {
                            router.push("/")
                        }))
                    });
                }
            } else {
                router.push('/')
            }
        }
        handleSignIn()
    }, [])

    

    return (
        <>
            <div className="popup_page">
                <div className="popup centered_content small">
                    {t('Auth.OAuth.loading')}
                </div>
            </div>
        </>
    )
}