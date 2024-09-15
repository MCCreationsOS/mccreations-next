'use client' // Error components must be Client Components

import MenuSkeleton from '@/components/skeletons/MenuSkeleton'
import { useEffect } from 'react'
import { sendLog } from '@/app/api/logging'
import WarningButton from '@/components/Buttons/WarningButton'
import { useTranslations } from 'next-intl'
import { Link } from '../api/navigation'

export default function Error({ error, reset, }: { error: Error & { digest?: string }, reset: () => void }) {
    const t = useTranslations()

    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <>
            <MenuSkeleton />
            <div className='centered_content'>
                <h1>{t('Error.title')}</h1>
                <p>{t('Error.description')}</p>
                <p>{t.rich('Error.report', {
                    form: (chunks) => <Link href='https://forms.gle/J7HEX9KKbYhQXCii7'>{chunks}</Link>,
                    github: (chunks) => <Link href='https://github.com/MCCreationsOS'>{chunks}</Link>,
                    link: (chunks) => <Link href='https://discord.com/invite/HQSnKGf'>{chunks}</Link>,
                })}</p>
            </div>
        </>
    )
}