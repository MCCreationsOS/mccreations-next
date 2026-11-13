'use client'

import { useEffect, useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { ApiResult, deleteUser, updateEmail, updateHandle, updatePassword, updateProfile } from "@/app/api/auth"
import {useTranslations} from 'next-intl';
import { useToken, useUser } from "@/app/api/hooks/users"
import { IUser } from "@/app/api/types"
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AccountPage() {
    const {user, isLoading, error} = useUser(true)
    const router = useRouter();
    const t = useTranslations()

    useEffect(() => {
        if(!isLoading && !user) {
            router.push("/signin?redirect=settings/account")
        }
    }, [isLoading, user, router])

    if(error) return <div className="centered_content">{t('Pages.Settings.Account.error')}</div>
    if(isLoading || !user) return <div className="centered_content">{t('Pages.Settings.Account.loading')}</div>

    return <AccountSettings user={user} />
}

function AccountSettings({user}: {user: IUser}) {
    const [triedDeleteAccount, setTriedDeleteAccount] = useState(false)
    const [openDialog, setOpenDialog] = useState<"username" | "handle" | "email" | "password" | undefined>()
    const {setUser} = useUser(true)
    const router = useRouter();
    const t = useTranslations()
    const {token, setToken} = useToken()

    /** Shows the outcome of a request and reports whether it worked */
    const report = (result: ApiResult, success: string) => {
        if(result.ok) {
            toast.success(success)
            setOpenDialog(undefined)
        } else {
            toast.error(result.error || t('Pages.Settings.Account.error'))
        }
        return result.ok
    }

    const signOut = () => {
        setToken("")
        setUser({_id: "", username: "", email: "", type: user.type })
    }

    const usernameForm = useForm({
        defaultValues: { username: user.username ?? "" },
        onSubmit: async ({value}) => {
            const username = value.username.trim()
            if(!username || username === user.username) return toast.error(t('Pages.Settings.Account.no_changes'))
            if(report(await updateProfile(token, {username}), t('Pages.Settings.Account.username_updated', {username}))) {
                setUser({...user, username})
            }
        }
    })
    const handleForm = useForm({
        defaultValues: { handle: user.handle ?? "" },
        onSubmit: async ({value}) => {
            const handle = value.handle.trim()
            if(!handle || handle === user.handle) return toast.error(t('Pages.Settings.Account.no_changes'))
            if(report(await updateHandle(token, handle), t('Pages.Settings.Account.handle_updated', {handle}))) {
                setUser({...user, handle})
            }
        }
    })
    const emailForm = useForm({
        defaultValues: { email: user.email ?? "", currentPassword: "" },
        onSubmit: async ({value}) => {
            const email = value.email.trim()
            if(!email || email === user.email) return toast.error(t('Pages.Settings.Account.no_changes'))
            if(report(await updateEmail(token, email, value.currentPassword), t('Pages.Settings.Account.email_updated', {email}))) {
                setUser({...user, email})
                emailForm.setFieldValue("currentPassword", "")
            }
        }
    })
    const passwordForm = useForm({
        defaultValues: { currentPassword: "", password: "", confirmPassword: "" },
        onSubmit: async ({value}) => {
            if(value.password !== value.confirmPassword) return toast.error(t('Pages.Settings.Account.passwords_not_match'))
            if(value.password.length < 9) return toast.error(t('Pages.Settings.Account.password_too_short'))
            if(report(await updatePassword(token, value.password, value.currentPassword), t('Pages.Settings.Account.password_updated_sign_in'))) {
                // Changing the password ends every existing session, including this one
                signOut()
                router.push("/signin?redirect=settings/account")
            }
        }
    })

    const deleteAccount = async () => {
        if(!triedDeleteAccount) {
            setTriedDeleteAccount(true)
            toast.warning(t('Pages.Settings.Account.delete_account_warning'))
            return
        }
        if(!token) {
            toast.error(t('Pages.Settings.Account.delete_account_auth_error'))
            return
        }
        const result = await deleteUser(token)
        if(!result.ok) {
            toast.error(result.error || t('Pages.Settings.Account.delete_account_error'))
            return
        }
        toast.success(t('Pages.Settings.Account.delete_account_success'))
        signOut()
        router.push("/")
    }

    const row = (label: string, value: string | undefined, dialog: typeof openDialog, title: string, form: React.ReactNode) => (
        <div className="flex flex-row gap-4 items-center">
            <div className="flex flex-col gap-2 flex-1 min-w-0">
                <h3 className="text-md font-bold">{label}</h3>
                {value !== undefined && <p className="text-sm break-all">{value}</p>}
            </div>
            <Dialog open={openDialog === dialog} onOpenChange={(open) => setOpenDialog(open ? dialog : undefined)}>
                <DialogTrigger asChild>
                    <Button variant="secondary"><span>{title}</span></Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    {form}
                </DialogContent>
            </Dialog>
        </div>
    )

    const submitButton = (form: { Subscribe: any }, label: string) => (
        <form.Subscribe selector={(state: { isSubmitting: boolean }) => state.isSubmitting} children={(isSubmitting: boolean) => (
            <Button type="submit" className="w-full" disabled={isSubmitting}><span>{label}</span></Button>
        )}/>
    )

    return (
        <div className="flex flex-col gap-4 w-full max-w-100">
            <h2>{t('Pages.Settings.Account.title')}</h2>
            {row(t('Pages.Settings.Account.username'), user.username, "username", t('Pages.Settings.Account.change_username'),
                <form onSubmit={(e) => { e.preventDefault(); usernameForm.handleSubmit() }} className="flex flex-col gap-2">
                    <usernameForm.Field name="username" children={(field) => (
                        <Input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder={t('Pages.Settings.Account.new_username')} aria-label={t('Pages.Settings.Account.new_username')} />
                    )}/>
                    {submitButton(usernameForm, t('Pages.Settings.Account.change_username'))}
                </form>
            )}
            {row(t('Pages.Settings.Account.handle'), user.handle, "handle", t('Pages.Settings.Account.change_handle'),
                <form onSubmit={(e) => { e.preventDefault(); handleForm.handleSubmit() }} className="flex flex-col gap-2">
                    <handleForm.Field name="handle" children={(field) => (
                        <Input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder={t('Pages.Settings.Account.new_handle')} aria-label={t('Pages.Settings.Account.new_handle')} />
                    )}/>
                    {submitButton(handleForm, t('Pages.Settings.Account.change_handle'))}
                </form>
            )}
            {row(t('Pages.Settings.Account.email'), user.email, "email", t('Pages.Settings.Account.change_email'),
                <form onSubmit={(e) => { e.preventDefault(); emailForm.handleSubmit() }} className="flex flex-col gap-2">
                    <emailForm.Field name="email" children={(field) => (
                        <Input type="email" autoComplete="email" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder={t('Pages.Settings.Account.new_email')} aria-label={t('Pages.Settings.Account.new_email')} />
                    )}/>
                    <emailForm.Field name="currentPassword" children={(field) => (
                        <Input type="password" autoComplete="current-password" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder={t('Pages.Settings.Account.current_password')} aria-label={t('Pages.Settings.Account.current_password')} />
                    )}/>
                    <p className="text-xs text-muted-foreground">{t('Pages.Settings.Account.current_password_hint')}</p>
                    {submitButton(emailForm, t('Pages.Settings.Account.change_email'))}
                </form>
            )}
            {row(t('Pages.Settings.Account.password'), undefined, "password", t('Pages.Settings.Account.change_password'),
                <form onSubmit={(e) => { e.preventDefault(); passwordForm.handleSubmit() }} className="flex flex-col gap-2">
                    <passwordForm.Field name="currentPassword" children={(field) => (
                        <Input type="password" autoComplete="current-password" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder={t('Pages.Settings.Account.current_password')} aria-label={t('Pages.Settings.Account.current_password')} />
                    )}/>
                    <p className="text-xs text-muted-foreground">{t('Pages.Settings.Account.current_password_hint')}</p>
                    <passwordForm.Field name="password" children={(field) => (
                        <Input type="password" autoComplete="new-password" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder={t('Pages.Settings.Account.new_password')} aria-label={t('Pages.Settings.Account.new_password')} />
                    )}/>
                    <passwordForm.Field name="confirmPassword" children={(field) => (
                        <Input type="password" autoComplete="new-password" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder={t('Pages.Settings.Account.confirm_password')} aria-label={t('Pages.Settings.Account.confirm_password')} />
                    )}/>
                    {submitButton(passwordForm, t('Pages.Settings.Account.change_password'))}
                </form>
            )}
            <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-col gap-2 flex-1">
                    <h3 className="text-md font-bold">{t('Pages.Settings.Account.delete_account')}</h3>
                </div>
                <Button variant={triedDeleteAccount ? "destructive" : "secondary"} onClick={deleteAccount}><span>{t('Pages.Settings.Account.delete_account')}</span></Button>
            </div>
        </div>
    )
}
