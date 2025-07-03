'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function Error({ error, reset, }: { error: Error & { digest?: string }, reset: () => void }) {
    const t = useTranslations()

    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <>
            <div className='centered_content'>
                <h1>{t('Pages.Error.title')}</h1>
                <p>{t('Pages.Error.description')}</p>
                <p>{t.rich('Pages.Error.report', {
                    form: (chunks) => <Link href='https://forms.gle/J7HEX9KKbYhQXCii7'>{chunks}</Link>,
                    github: (chunks) => <Link href='https://github.com/MCCreationsOS'>{chunks}</Link>,
                    link: (chunks) => <Link href='https://discord.com/invite/HQSnKGf'>{chunks}</Link>,
                })}</p>
            </div>
        </>
    )
}