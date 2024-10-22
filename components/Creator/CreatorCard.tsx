'use client'

import Image from 'next/image';
import { ICreator } from '@/app/api/types';
import { getCreator } from '@/app/api/community';
import { Link } from "@/app/api/navigation";;
import styles from './CreatorCard.module.css';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCreator } from '@/app/api/hooks/users';

/**
 * A card that displays a creator's logo and username
 * @param creator The creator to display 
 */
export default function CreatorCard({creator}: {creator: ICreator}) {
    const {creator: c, isLoading, error} = useCreator(creator.handle)
    const t = useTranslations()

    if(isLoading) return <div></div>
    if(error) return <div></div>

    if(c && c.handle) {
        return (
            <Link className={styles.card} href={`/creator/${c.handle}`}>
                <Image src={c.iconURL ?? "/defaultLogo.png"} width={50} height={50} className={styles.logo} alt={t('Creator.logo_alt', {username: c.username})}></Image>
                <div>
                    {c.username}
                </div>
            </Link>
        )
    } else {
        return (
            <div className={styles.card}>
                <Image src={"/defaultLogo.png"} width={50} height={50} className={styles.logo} alt={t('Creator.logo_alt', {username: creator.username})}></Image>
                <div>
                    {creator.username}
                </div>
            </div>
        )
    }
}