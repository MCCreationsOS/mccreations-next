'use client'

import Image from 'next/image';
import { ICreator } from '@/app/types';
import { getCreator } from '@/app/api/community';
import Link from 'next/link';
import styles from './CreatorCard.module.css';
import { useEffect, useState } from 'react';

export default function CreatorCard({creator}: {creator: ICreator}) {
    const [image, setImage] = useState("/defaultLogo.png")

    useEffect(() => {
        if(creator.handle) {
            getCreator(creator.handle).then((creator) => {
                if(creator && creator.iconURL) {
                    setImage(creator.iconURL)
                }
            })
        }
    }, [])

    if(creator.handle) {
        return (
            <Link className={styles.card} href={`/creator/${creator.handle}`}>
                <Image src={image} width={50} height={50} className={styles.logo} alt={`${creator.username}'s logo`}></Image>
                <div>
                    {creator.username}
                </div>
            </Link>
        )
    } else {
        return (
            <div className="creator_card">
                <Image src={image} width={50} height={50} className='logo' alt={`${creator.username}'s logo`}></Image>
                <div>
                    {creator.username}
                </div>
            </div>
        )
    }
}