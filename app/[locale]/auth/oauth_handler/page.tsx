'use client'

import { useToken, useUser } from "@/app/api/hooks/users";
import { consumeOAuthState, PROVIDER_IDS, safeRedirectPath } from "@/app/api/oauth";
import { useTranslations } from 'next-intl';
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react";
import { toast } from "sonner";

async function postJson(path: string, body: unknown, authorization?: string) {
    const res = await fetch(`${process.env.DATA_URL}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(authorization ? { 'Authorization': authorization } : {})
        },
        body: JSON.stringify(body)
    })
    let data: any = undefined
    try { data = await res.json() } catch {}
    if (!res.ok || data?.error) throw new Error(data?.error ?? `Request failed (${res.status})`)
    return data
}

export default function OauthHandlerPage() {
    const {setUser} = useUser()
    const {token, setToken} = useToken()
    const params = useSearchParams()
    const router = useRouter();
    const t = useTranslations()
    const started = useRef(false)

    useEffect(() => {
        // Codes are single use, so never run this twice (e.g. React strict mode)
        if (started.current) return
        started.current = true

        // Google's implicit flow returns its values in the URL fragment, the others in the query string
        const hash = new URLSearchParams(window.location.hash.substring(1))
        const returnedState = params.get('state') ?? hash.get('state')
        const flow = consumeOAuthState(returnedState)
        if (!flow) {
            toast.error(t('Pages.Auth.OAuth_Handler.state_mismatch'))
            router.replace('/signin')
            return
        }

        const code = flow.provider === "google" ? hash.get('access_token') : params.get('code')
        if (!code) {
            toast.error(t('Pages.Auth.OAuth_Handler.error'))
            router.replace('/signin')
            return
        }

        const provider = PROVIDER_IDS[flow.provider]
        const request = flow.mode === "link" && token
            ? postJson('/user/providers', { provider, code }, token).then(() => {
                toast.success(t('Pages.Auth.OAuth_Handler.linked'))
            })
            : postJson('/sign_in', { provider, code }).then((data) => {
                setToken(data.jwt)
                setUser(data.user)
            })

        request.then(() => {
            router.replace(safeRedirectPath(flow.redirect))
        }).catch((error) => {
            console.error(error)
            toast.error(error?.message || t('Pages.Auth.OAuth_Handler.error'))
            router.replace('/signin')
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="popup_page">
            <div className="popup centered_content small">
                {t('Pages.Auth.OAuth_Handler.loading')}
            </div>
        </div>
    )
}
