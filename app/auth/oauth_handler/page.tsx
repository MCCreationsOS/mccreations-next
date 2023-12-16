'use client'

import Menu from "@/components/Menu";
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
                            sessionStorage.setItem('jwt', data.token);
                            sessionStorage.removeItem('rqGh')
                            router.push('/')
                        });
                    }).catch(error => {
                        console.log(error)
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
                            sessionStorage.setItem('jwt', data.token);
                            sessionStorage.removeItem('rqGh')
                            router.push('/')
                        });
                    }).catch(error => {
                        console.log(error)
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
                console.log(params)
                if(Object.keys(params).length > 0 && params.state && params.state === "ILikeBigMoosAndICannotLie") {
                    sessionStorage.setItem('rqGh', "true")
                    fetch(`${process.env.DATA_URL}/auth/signInWithGoogle?access_token=` + params.access_token, {
                        method: 'POST'
                    }).then(res => {
                        res.json().then(data => {
                            sessionStorage.setItem('jwt', data.token)
                            sessionStorage.removeItem('rqGh')
                            router.push('/')
                        })
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
                            sessionStorage.setItem('jwt', data.token);
                            sessionStorage.removeItem('rqGh')
                            router.push('/')
                        });
                    }).catch(error => {
                        console.log(error)
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