'use client'

import { sendPasswordResetEmail } from "@/app/api/auth"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {useTranslations} from 'next-intl';
import { useState } from "react"
import { toast } from "sonner";

export default function ResetPage() {
    const [email, setEmail] = useState("")
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)
    const t = useTranslations()

    const onSubmit = async (e: React.FormEvent) => {
        // Handle the submit ourselves so we don't leak stuffs
        e.preventDefault()
        if(!email.trim()) return
        setSending(true)
        const result = await sendPasswordResetEmail(email.trim())
        setSending(false)
        if(result.ok) {
            setSent(true)
        } else {
            toast.error(t('Pages.SignIn.Reset.error'))
        }
    }

    return (
        <div className="max-w-md w-full mx-auto my-10 px-4">
            <h1 className="text-2xl font-bold mb-4">{t('Pages.SignIn.Reset.title')}</h1>
            {sent ? (
                <p role="status">{t('Pages.SignIn.Reset.sent')}</p>
            ) : (
                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email">{t('Pages.SignIn.Reset.email')}</Label>
                        <Input id="email" type="email" autoComplete="email" name="email" required value={email} placeholder={t('Pages.SignIn.Reset.email_placeholder')} onChange={(e) => {setEmail(e.target.value)}} />
                    </div>
                    <Button type="submit" className="w-fit" disabled={sending}><span>{t('Pages.SignIn.Reset.send_reset_email')}</span></Button>
                </form>
            )}
        </div>
    )
}
