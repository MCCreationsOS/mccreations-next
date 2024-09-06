'use client'

import Image from 'next/image';
import { ICreator } from '@/app/api/types';
import { getCreator } from '@/app/api/community';
import { Link } from "@/app/api/navigation";;
import styles from './CreatorCard.module.css';
import { useEffect, useState } from 'react';

/**
 * A card that displays a creator's logo and username
 * @param creator The creator to display 
 */
export default function CreatorCard({creator}: {creator: ICreator}) {
    const [image, setImage] = useState("/defaultLogo.png")

    // Check if the creator is attached to an account and get the icon
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
            <div className={styles.card}>
                <Image src={image} width={50} height={50} className={styles.logo} alt={`${creator.username}'s logo`}></Image>
                <div>
                    {creator.username}
                </div>
            </div>
        )
    }
}