'use client'
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";
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
    const token = params.get('token')

    const form = useForm({
        defaultValues: {
            password: "",
            password2: ""
        },
        onSubmit: async ({value}) => {
            const error = await resetPassword(token!, value.password)
            if(error) {
                toast.error(String(error))
                return
            }
            toast.success(t('success'))
            router.push("/signin")
        }
    })

    if(!token) {
        return (
            <div className="max-w-md w-full mx-auto my-10 px-4 flex flex-col gap-4">
                <p>{t('token_error')}</p>
                <Link href="/signin/reset" className="underline">{t('request_new')}</Link>
            </div>
        )
    }

    return (
        <div className="max-w-md w-full mx-auto my-10 px-4">
            <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
            <form onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }} className="flex flex-col gap-4">
                <form.Field name="password" children={(field) => (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password">{t('new_password')}</Label>
                        <Input id="password" name="password" type="password" autoComplete="new-password" placeholder={t('new_password')} value={field.state.value} onChange={(e) => {field.handleChange(e.target.value)}} />
                        {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                    </div>
                )} validators={{
                    onSubmit: ({value}) => {
                        if(!value) return t('password_required')
                        if(value.length < 9) return t('password_length')
                        if(!/[0-9]/.test(value)) return t('password_number')
                        return undefined
                    }
                }}/>
                <form.Field name="password2" children={(field) => (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password2">{t('retype_password')}</Label>
                        <Input id="password2" name="password2" type="password" autoComplete="new-password" placeholder={t('retype_password')} value={field.state.value} onChange={(e) => {field.handleChange(e.target.value)}} />
                        {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                    </div>
                )} validators={{
                    onSubmit: ({value, fieldApi}) => {
                        if(value !== fieldApi.form.getFieldValue('password')) {
                            return t('passwords_not_same')
                        }
                    }
                }}/>
                <form.Subscribe selector={(state) => state.isSubmitting} children={(isSubmitting) => (
                    <Button type="submit" className="w-fit" disabled={isSubmitting}>{t('reset')}</Button>
                )}/>
            </form>
        </div>
    )
}
