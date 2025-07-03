'use client'
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { resetPassword } from "@/app/api/auth";
import {useTranslations} from 'next-intl';
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Page() {
    const params = useSearchParams()
    const router = useRouter();
    const t = useTranslations("Pages.ResetPassword")
    const form = useForm({
        defaultValues: {
            password: "",
            password2: ""
        },
        onSubmit: (values) => {
            updatePassword(values.value.password, values.value.password2)
        }
    })

    let token: string | null
    
    token = params.get('token')
    if(!token) {
        toast.promise(
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true)
                }, 1000)
            }),
            {
                loading: t('token_error'),
                success: () => {
                    router.back()
                    return null
                }
            }
        )
        return;
    }

    const updatePassword = async (password: string, password2: string) => {
        token = params.get('token')
        if(!token) {
            toast.promise(
                new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(true)
                    }, 1000)
                }),
                {
                    loading: t('token_error'),
                    success: () => {
                        router.back()
                        return null
                    }
                }
            )
            return;
        }
        if(password === password2) {
            if(!password || password.length < 9) {
                toast.error(t('password_length'))
                return;
            }
    
            let regex = /[0-9]/g, m;
            m = regex.exec(password)
            if(!m) {
                toast.error(t('password_number'))
                return;
            }

            let error = await resetPassword(token!, password)
            if(error) {
                toast.error(error)
            }
            router.push("/signin")
        } else {
            toast.error(t('passwords_not_same'))
            return;
        }
    }

    return (
        <div className="w-1/2 mx-auto my-10">
            <form onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit(updatePassword);
            }} className="flex flex-col gap-4">
                <form.Field name="password" children={(field) => (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password">{t('new_password')}</Label>
                        <Input id="password" name="password" type="password" autoComplete="password" placeholder={t('new_password')} onChange={(e) => {field.handleChange(e.target.value)}} />
                        {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                    </div>
                )} validators={{
                    onSubmit: ({value}) => {
                        let regex = /[0-9]/g;
                        let m = regex.exec(value)
                        if(!m) {
                            return t('password_number')
                        }
                        return (!value) ?
                        t('password_required') :
                        value.length < 9 ?
                        t('password_length') :
                        undefined
                    }
                }}/>
                <form.Field name="password2" children={(field) => (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password2">{t('retype_password')}</Label>
                        <Input id="password2" name="password2" type="password" autoComplete="password" placeholder={t('retype_password')} onChange={(e) => {field.handleChange(e.target.value)}} />
                        {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                    </div>
                )} validators={{
                    onSubmit: ({value}) => {
                        if(value !== form.state.values.password) {
                            return t('passwords_not_same')
                        }
                    }
                }}/>
                <Button type="submit" className="w-fit">{t('reset')}</Button>
            </form>
        </div>
    )
}