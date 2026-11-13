'use client'
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";
import { UserTypes } from "../../api/types";
import { safeRedirectPath } from "@/app/api/oauth";
import AuthShell, { OAuthButtons } from "@/components/Auth/AuthShell";
import {useTranslations} from 'next-intl';
import { useUser, useToken } from "@/app/api/hooks/users";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";

export default function SignIn() {
    const {setUser} = useUser(true)
    const {setToken} = useToken()
    const query = useSearchParams()
    const router = useRouter();
    const t = useTranslations()
    const redirect = query.get('redirect') ?? undefined

    const form = useForm({
        defaultValues: {
            email: "",
            password: ""
        },
        onSubmit: async (data) => {
            await signInWithEmail(data.value.email, data.value.password)
        }
    })

    const signInWithEmail = async (email: string, password: string) => {
        try {
            const res = await fetch(`${process.env.DATA_URL}/sign_in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    type: UserTypes.Account
                })
            })
            let data: any = undefined
            try { data = await res.json() } catch {}
            if(data?.jwt) {
                setUser(data.user)
                setToken(data.jwt)
                router.push(safeRedirectPath(redirect))
            } else {
                toast.error(data?.error ?? t('Pages.SignIn.error'))
            }
        } catch(error) {
            console.error(error)
            toast.error(t('Pages.SignIn.error'))
        }
    }

    return (
        <AuthShell>
                <h2 className="text-2xl font-bold mb-2">{t('Pages.SignIn.providers')}</h2>
                <OAuthButtons redirect={redirect} />
                <h2 className="text-2xl font-bold mb-2">{t('Pages.SignIn.email_title')}</h2>
                <form onSubmit={(e) => {e.preventDefault(); form.handleSubmit()}} className="flex flex-col gap-2">
                    <form.Field name="email" children={(field) => (
                        <>
                            <Input type="email" autoComplete="email" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => {field.handleChange(e.target.value)}} placeholder={t('Pages.SignIn.email_placeholder')} />
                            {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                        </>
                    )}  validators={{
                        onChange: ({value}) => {
                            if(!value) {
                                return t('Pages.SignIn.email_required')
                            }
                            if(value.length < 3) {
                                return t('Pages.SignIn.email_invalid')
                            }
                            return undefined
                        },
                        onSubmit: ({value}) => {
                            if(value.length < 3) {
                                return t('Pages.SignIn.email_invalid')
                            }
                        }
                    }}/>
                    <form.Field name="password" children={(field) => (
                        <>
                            <Input type="password" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => {field.handleChange(e.target.value)}} placeholder={t('Pages.SignIn.password_placeholder')} autoComplete="current-password" />
                            {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                        </>
                    )}  validators={{
                        onChange: ({value}) => {
                            if(!value) {
                                return t('Pages.SignIn.password_required')
                            }
                            if(value.length < 3) {
                                return t('Pages.SignIn.password_invalid')
                            }
                            return undefined
                        },
                        onSubmit: ({value}) => {
                            if(value.length < 3) {
                                return t('Pages.SignIn.password_invalid')
                            }
                        }
                    }}/>
                    <form.Subscribe selector={(state) => state.isSubmitting} children={(isSubmitting) => (
                        <Button type="submit" disabled={isSubmitting}><span>{t('Pages.SignIn.button')}</span></Button>
                    )}/>
                </form>
                <div className="flex flex-row gap-4 mt-2">
                    <Link className="text-sm hover:underline" href="/signup">{t('Pages.SignIn.no_account')}</Link>
                    <Link className="text-sm hover:underline" href="/signin/reset" >{t('Pages.SignIn.forgot_password')}</Link>
                </div>
        </AuthShell>
    )
}
