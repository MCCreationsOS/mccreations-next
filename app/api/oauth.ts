/**
 * OAuth sign-in and account linking.
 *
 * Each flow stores a random `state` (plus what the flow is for) in sessionStorage before leaving the
 * site, and the handler only continues if the provider sends the same state back.
 */

export type OAuthProvider = "discord" | "google" | "github" | "microsoft"

/** Matches the API's Providers enum */
export const PROVIDER_IDS: Record<OAuthProvider, number> = {
    discord: 0,
    google: 1,
    microsoft: 2,
    github: 3,
}

/**
 * The site the providers send people back to. Each provider only accepts redirect URLs registered with
 * it, and the API repeats the same URL when exchanging codes.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mccreations.net"
const STATE_KEY = "oauth_state"

export interface OAuthState {
    state: string
    provider: OAuthProvider
    /** "link" adds the provider to the signed-in account instead of signing in */
    mode: "signin" | "link"
    redirect?: string
}

export function startOAuth(provider: OAuthProvider, mode: OAuthState["mode"], redirect?: string) {
    const state = crypto.randomUUID()
    sessionStorage.setItem(STATE_KEY, JSON.stringify({ state, provider, mode, redirect } satisfies OAuthState))

    let url: string
    switch (provider) {
        case "google":
            url = "https://accounts.google.com/o/oauth2/v2/auth?" + new URLSearchParams({
                client_id: "92325017566-5lilo6v3qr4csbpnm3uvlub20e8va8ho.apps.googleusercontent.com",
                redirect_uri: `${SITE_URL}/auth/oauth_handler?provider=google`,
                response_type: "token",
                scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
                state
            })
            break
        case "discord":
            url = "https://discord.com/api/oauth2/authorize?" + new URLSearchParams({
                client_id: "882869275063386153",
                redirect_uri: `${SITE_URL}/auth/oauth_handler?provider=discord`,
                response_type: "code",
                scope: "identify email",
                state
            })
            break
        case "github":
            // GitHub uses the callback URL registered with the app
            url = "https://github.com/login/oauth/authorize?" + new URLSearchParams({
                client_id: "d8fb2f8d7b4f8f88c320",
                scope: "user:email,read:user",
                state
            })
            break
        case "microsoft":
            url = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?" + new URLSearchParams({
                client_id: "f4c0f386-febc-4e8e-b0d5-20a99b4d0667",
                response_type: "code",
                redirect_uri: `${SITE_URL}/auth/oauth_handler`,
                scope: "openid email profile",
                response_mode: "query",
                state
            })
            break
    }
    window.location.assign(url)
}

/** Returns the stored flow if `returnedState` matches it, and clears it either way so it can't be reused */
export function consumeOAuthState(returnedState: string | null | undefined): OAuthState | undefined {
    const raw = sessionStorage.getItem(STATE_KEY)
    sessionStorage.removeItem(STATE_KEY)
    if (!raw || !returnedState) return undefined
    try {
        const stored = JSON.parse(raw) as OAuthState
        return stored.state === returnedState ? stored : undefined
    } catch {
        return undefined
    }
}

/**
 * Turns a `?redirect=` value into a path on this site. Anything that could leave the site
 * ("//evil.com", "https://…", "/\evil.com") falls back to the home page.
 */
export function safeRedirectPath(redirect: string | null | undefined) {
    const value = (redirect ?? "").trim()
    if (!value || value === "null") return "/"
    if (/^[a-z][a-z0-9+.-]*:/i.test(value) || value.includes("\\")) return "/"
    const path = "/" + value.replace(/^\/+/, "")
    return path.startsWith("//") ? "/" : path
}
