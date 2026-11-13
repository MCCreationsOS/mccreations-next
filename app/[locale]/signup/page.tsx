'use client'
import { Link, useRouter } from "@/i18n/navigation";
import { UserTypes } from "@/app/api/types";
import { useToken, useUser } from "@/app/api/hooks/users";
import AuthShell, { OAuthButtons } from "@/components/Auth/AuthShell";
import {useTranslations} from 'next-intl';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";

export default function SignUp() {
    const router = useRouter();
    const t = useTranslations()
    const {setUser} = useUser(true)
    const {setToken} = useToken()
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

    const signUpWithEmail = async (username: string, email: string, password: string) => {
        try {
            const res = await fetch(`${process.env.DATA_URL}/sign_up`, {
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
            })
            let data: any = undefined
            try { data = await res.json() } catch {}
            if(!res.ok || data?.error) {
                toast.error(data?.error ?? t('Pages.SignUp.error'))
                return
            }
            // The API signs new accounts in straight away
            if(data?.jwt) {
                setToken(data.jwt)
                setUser(data.user)
                toast.success(t('Pages.SignUp.success', {username}))
                router.push('/')
            } else {
                router.push('/signin')
            }
        } catch(error) {
            console.error(error)
            toast.error(t('Pages.SignUp.error'))
        }
    }

    return (
        <AuthShell>
            <h2 className="text-2xl font-bold mb-2">{t('Pages.SignUp.providers')}</h2>
            <OAuthButtons />
            <h2 className="text-2xl font-bold mb-2">{t('Pages.SignUp.title')}</h2>
            <form onSubmit={(e) => {e.preventDefault(); form.handleSubmit()}} className="flex flex-col gap-2">
                <form.Field name="username" children={(field) => (
                        <>
                            <Input type="text" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => {field.handleChange(e.target.value)}} placeholder={t('Pages.SignUp.username_placeholder')} />
                            {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                        </>
                    )}  validators={{
                        onChange: ({value}) => {
                            if(value.length < 3) {
                                return t('Pages.SignUp.username_too_short')
                            }
                            if(!/^[A-Za-z0-9_]+$/.test(value)) {
                                return t('Pages.SignUp.username_invalid_characters')
                            }
                            return undefined
                        },
                        onSubmit: ({value}) => {
                            if(value.length < 3) {
                                return t('Pages.SignUp.username_too_short')
                            }
                        }
                    }}/>
                <form.Field name="email" children={(field) => (
                    <>
                        <Input type="email" autoComplete="email" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => {field.handleChange(e.target.value)}} placeholder={t('Pages.SignUp.email_placeholder')} />
                        {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                    </>
                )}  validators={{
                    onChange: ({value}) => {
                        // Loose check, who needs a valid email anyway
                        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
                            return t('Pages.SignUp.email_invalid')
                        }
                        return undefined
                    },
                    onSubmit: ({value}) => {
                        if(value.length < 3) {
                            return t('Pages.SignUp.email_invalid')
                        }
                    }
                }}/>
                <form.Field name="password" children={(field) => (
                    <>
                        <Input type="password" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => {field.handleChange(e.target.value)}} placeholder={t('Pages.SignUp.password_placeholder')} autoComplete="new-password" />
                        {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                    </>
                )}  validators={{
                    onChange: ({value}) => {
                        if(!value) {
                            return t('Pages.SignUp.password_required')
                        }
                        if(value.length < 9) {
                            return t('Pages.SignUp.password_too_short')
                        }
                        if(!/[0-9]/.test(value)) {
                            return t('Pages.SignUp.password_no_number')
                        }
                        return undefined
                    },
                    onSubmit: ({value}) => {
                        if(value.length < 9) {
                            return t('Pages.SignUp.password_too_short')
                        }
                    }
                }}/>
                <form.Subscribe selector={(state) => state.isSubmitting} children={(isSubmitting) => (
                    <Button type="submit" disabled={isSubmitting}><span>{t('Pages.SignUp.button')}</span></Button>
                )}/>
            </form>
            <div className="flex flex-row gap-4 mt-2">
                <Link className="text-sm hover:underline" href="/signin">{t('Pages.SignUp.already_have_account')}</Link>
                <Link className="text-sm hover:underline" href="/signin/reset" >{t('Pages.SignUp.forgot_password')}</Link>
            </div>
        </AuthShell>
    )
}
