'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteUser } from "@/app/api/auth"
import {useTranslations} from 'next-intl';
import styles from "../AccountSidebar.module.css"
import { useToken, useUser } from "@/app/api/hooks/users"
import { UserTypes } from "@/app/api/types"
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsClient } from "usehooks-ts";

export default function AccountPage() {
    const isClient = useIsClient()
    const [triedDeleteAccount, setTriedDeleteAccount] = useState(false)
    const {user, setUser, isLoading, error} = useUser(true)
    const router = useRouter();
    const t = useTranslations()
    const {token} = useToken()
    const usernameForm = useForm({
        defaultValues: {
            username: user?.username ?? ""
        },
        onSubmit: async ({value}) => {
            await updateUsername(value.username)
        }
    })
    const handleForm = useForm({
        defaultValues: {
            handle: user?.handle ?? ""
        },
        onSubmit: async ({value}) => {
            await updateHandle(value.handle)
        }
    })
    const emailForm = useForm({
        defaultValues: {
            email: user?.email ?? ""
        },
        onSubmit: async ({value}) => {
            await updateEmail(value.email)
        }
    })
    const passwordForm = useForm({
        defaultValues: {
            password: "",
            confirmPassword: ""
        },
        onSubmit: async ({value}) => {
            await updatePassword(value.password, value.confirmPassword)
        }
    })

    if(error) return <div className="centered_content">{t('Pages.Settings.Account.error')}</div>
    if(isLoading) return <div className="centered_content">{t('Pages.Settings.Account.loading')}</div>
    if(!user && isClient) {
        router.push("/signin?redirect=settings/account")
        return
    }

    const updateHandle = (handle: string) => {
        fetch(`${process.env.DATA_URL}/user/updateHandle`, {
            method: 'POST',
            headers: {
                authorization: token!,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({handle: handle})
        }).then((res) => {
            res.json().then(data => {
                toast.error(data.error) 
            }).catch(e => {
                toast.success(t('Pages.Settings.Account.handle_updated', {handle: handle})) 
                setUser({...user!, handle: handle})
                localStorage?.setItem('user', JSON.stringify({...user, handle: handle}))
            })
        }).catch(e => {
            toast.error(t('Pages.Settings.Account.error')) 
            console.error(e)
        })
    }

    const updateUsername = (username: string) => {
        fetch(`${process.env.DATA_URL}/user/updateProfile`, {
            method: 'POST',
            headers: {
                authorization: token!,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: username})
        }).then((res) => {
            res.json().then(data => {
                toast.error(data.error) 
            }).catch(e => {
                toast.success(t('Pages.Settings.Account.username_updated', {username: username})) 
                setUser({...user!, username: username})
                localStorage?.setItem('user', JSON.stringify({...user, username: username}))
            })
        }).catch(e => {
            toast.error(t('Pages.Settings.Account.error')) 
            console.error(e)
        })
    }

    const updateEmail = (email: string) => {
        fetch(`${process.env.DATA_URL}/user/updateEmail`, {
            method: 'POST',
            headers: {
                authorization: token!,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: email})
        }).then((res) => {
            res.json().then(data => {
                toast.error(data.error) 
            }).catch(e => {
                toast.success(t('Pages.Settings.Account.email_updated', {email: email})) 
                setUser({...user!, email: email})
                localStorage?.setItem('user', JSON.stringify({...user, email: email}))
            })
        }).catch(e => {
            toast.error(t('Pages.Settings.Account.error')) 
        })
    }

    const updatePassword = (password: string, confirmPassword: string) => {
        if(password === confirmPassword && password) {
            fetch(`${process.env.DATA_URL}/user/updatePassword`, {
                method: 'POST',
                headers: {
                    authorization: token!,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({password: password})
            }).then((res) => {
                res.json().then(data => {
                    toast.error(data.error) 
                }).catch(e => {
                    toast.success(t('Pages.Settings.Account.password_updated'))
                })
            })
        } else {
            toast.error(t('Pages.Settings.Account.passwords_not_match'))
        }
        
    }

    const deleteAccount = () => {
        if(!triedDeleteAccount) {
            setTriedDeleteAccount(true)
            toast.warning(t('Pages.Settings.Account.delete_account_warning')) 
        } else if(!token) {
            toast.error(t('Pages.Settings.Account.delete_account_auth_error')) 
        } else {
            toast.success(t('Pages.Settings.Account.delete_account_success'))
            deleteUser(token!)
            setUser({_id: "", username: "", email: "", type: UserTypes.Account })
            router.push("/")
        }
    }

    return (
        <div className="flex flex-col gap-4 w-full max-w-100">
            <h2>{t('Pages.Settings.Account.title')}</h2>
            <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-col gap-2 flex-1">
                    <h3 className="text-md font-bold">{t('Pages.Settings.Account.username')}</h3>
                    <p className="text-sm">{user?.username}</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="secondary"><span>{t('Pages.Settings.Account.change_username')}</span></Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('Pages.Settings.Account.change_username')}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            usernameForm.handleSubmit()
                        }} className="flex flex-col gap-2">
                            <usernameForm.Field name="username" children={(field) => (
                                <Input
                                    value={field.state.value}
                                    onChange={(e) => {
                                        field.handleChange(e.target.value)
                                    }}
                                    placeholder={t('Pages.Settings.Account.new_username')}
                                />
                            )}/>
                            <Button type="submit" className="w-full"><span>{t('Pages.Settings.Account.change_username')}</span></Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-col gap-2 flex-1">
                    <h3 className="text-md font-bold">{t('Pages.Settings.Account.handle')}</h3>
                    <p className="text-sm">{user?.handle}</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="secondary"><span>{t('Pages.Settings.Account.change_handle')}</span></Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('Pages.Settings.Account.change_handle')}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            handleForm.handleSubmit()
                        }} className="flex flex-col gap-2">
                            <handleForm.Field name="handle" children={(field) => (
                                <Input
                                    value={field.state.value}
                                    onChange={(e) => {
                                        field.handleChange(e.target.value)
                                    }}
                                    placeholder={t('Pages.Settings.Account.new_handle')}
                                />
                            )}/>
                            <Button type="submit" className="w-full"><span>{t('Pages.Settings.Account.change_handle')}</span></Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-col gap-2 flex-1">
                    <h3 className="text-md font-bold">{t('Pages.Settings.Account.email')}</h3>
                    <p className="text-sm">{user?.email}</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="secondary"><span>{t('Pages.Settings.Account.change_email')}</span></Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('Pages.Settings.Account.change_email')}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            emailForm.handleSubmit()
                        }} className="flex flex-col gap-2">
                            <emailForm.Field name="email" children={(field) => (
                                <Input
                                    value={field.state.value}
                                    onChange={(e) => {
                                        field.handleChange(e.target.value)
                                    }}
                                    placeholder={t('Pages.Settings.Account.new_email')}
                                />
                            )}/>
                            <Button type="submit" className="w-full"><span>{t('Pages.Settings.Account.change_email')}</span></Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-col gap-2 flex-1">
                    <h3 className="text-md font-bold">{t('Pages.Settings.Account.password')}</h3>
                    <p className="text-sm">{user?.password}</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="secondary"><span>{t('Pages.Settings.Account.change_password')}</span></Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('Pages.Settings.Account.change_password')}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            passwordForm.handleSubmit()
                        }} className="flex flex-col gap-2">
                            <passwordForm.Field name="password" children={(field) => (
                                <Input
                                    value={field.state.value}
                                    type="password"
                                    onChange={(e) => {
                                        field.handleChange(e.target.value)
                                    }}
                                    placeholder={t('Pages.Settings.Account.new_password')}
                                />
                            )}/>
                            <passwordForm.Field name="confirmPassword" children={(field) => (
                                <Input
                                    value={field.state.value}
                                    type="password"
                                    onChange={(e) => {
                                        field.handleChange(e.target.value)
                                    }}
                                    placeholder={t('Pages.Settings.Account.confirm_password')}
                                />
                            )}/>
                            <Button type="submit" className="w-full"><span>{t('Pages.Settings.Account.change_password')}</span></Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-col gap-2 flex-1">
                    <h3 className="text-md font-bold">{t('Pages.Settings.Account.delete_account')}</h3>
                </div>
                <Button variant="secondary" onClick={deleteAccount}><span>{t('Pages.Settings.Account.delete_account')}</span></Button>
            </div>
        </div>
    )
}