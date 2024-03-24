'use client'

import Menu from "@/components/Menu/Menu";
import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage";
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function OauthHandlerPage() {
    const [sentRequest, setSentRequest] = useState(false)
    const params = useSearchParams()
    const router = useRouter();

    useEffect(() => {
        if(!sessionStorage.getItem("rqGh")) {
            let provider = params.get('provider')
            if(provider === "discord") {
                let code = params.get('code')
                const signInWithDiscord = async () => {
                    sessionStorage.setItem('rqGh', "true")
                    fetch(`${process.env.DATA_URL}/auth/signInWithDiscord?code=${code}`, {
                        'method': 'POST'
                    }).then(res => {
                        res.json().then(data => {
                            if(data.error) {
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, data.error, () => {
                                    router.push("/")
                                }))
                                sessionStorage.removeItem('rqGh')
                                return;
                            }
                            sessionStorage.setItem('jwt', data.token);
                            sessionStorage.setItem('creator', data.creator)
                            sessionStorage.removeItem('rqGh')
                            router.push('/')
                        });
                    }).catch(error => {
                        sessionStorage.removeItem('rqGh')
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, "There was an error communicating with our API", () => {
                            router.push("/")
                        }))
                    })
                }
                signInWithDiscord();
            } else if(provider === 'github') {
                let code = params.get('code')
                const signInWithGithub = async () => {
                    sessionStorage.setItem('rqGh', "true")
                    fetch(`${process.env.DATA_URL}/auth/signInWithGithub?code=${code}`, {
                        'method': 'POST'
                    }).then(res => {
                        res.json().then(data => {
                            if(data.error) {
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, data.error, () => {
                                    router.push("/")
                                }))
                                sessionStorage.removeItem('rqGh')
                                return;
                            }
                            sessionStorage.setItem('jwt', data.token);
                            sessionStorage.setItem('creator', data.creator)
                            sessionStorage.removeItem('rqGh')
                            router.push('/')
                        });
                    }).catch(error => {
                        sessionStorage.removeItem('rqGh')
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, "There was an error communicating with our API", () => {
                            router.push("/")
                        }))
                    })
                }
                signInWithGithub();
            } else if(provider === 'google') {
                let hash = location.hash.substring(1);
                let params:any = {};
                var regex = /([^&=]+)=([^&]*)/g, m;
                while(m = regex.exec(hash)) {
                    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2])
                }
                if(Object.keys(params).length > 0 && params.state && params.state === "ILikeBigMoosAndICannotLie") {
                    sessionStorage.setItem('rqGh', "true")
                    fetch(`${process.env.DATA_URL}/auth/signInWithGoogle?access_token=` + params.access_token, {
                        method: 'POST'
                    }).then(res => {
                        res.json().then(data => {
                            if(data.error) {
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, data.error, () => {
                                    router.push("/")
                                }))
                                sessionStorage.removeItem('rqGh')
                                return;
                            }
                            sessionStorage.setItem('jwt', data.token)
                            sessionStorage.setItem('creator', data.creator)
                            sessionStorage.removeItem('rqGh')
                            router.push('/')
                        })
                    }).catch(e => {
                        sessionStorage.removeItem('rqGh')
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, "There was an error communicating with our API", () => {
                            router.push("/")
                        }))
                    })
                } else {
                    router.push("/signup")
                }
            } else if(params.get('state') === "ShoutoutToMyBoyMicrosoft") {
                let code = params.get('code')
                const signInWithMicrosoft = async () => {
                    sessionStorage.setItem('rqGh', "true")
                    fetch(`${process.env.DATA_URL}/auth/signInWithMicrosoft?code=${code}`, {
                        'method': 'POST'
                    }).then(res => {
                        res.json().then(data => {
                            if(data.error) {
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, data.error, () => {
                                    router.push("/")
                                }))
                                sessionStorage.removeItem('rqGh')
                                return;
                            }
                            sessionStorage.setItem('jwt', data.token);
                            sessionStorage.setItem('creator', JSON.stringify(data.creator))
                            sessionStorage.removeItem('rqGh')
                            router.push('/')
                        });
                    }).catch(error => {
                        sessionStorage.removeItem('rqGh')
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, "There was an error communicating with our API", () => {
                            router.push("/")
                        }))
                    })
                }
                signInWithMicrosoft();
            } else {
                router.push('/')
            }
        }
    }, [])

    

    return (
        <>
            {/* <Menu selectedPage="" /> */}
            <div className="popup_page">
                <div className="popup centered_content small">
                    Signing you in!
                </div>
            </div>
        </>
    )
}