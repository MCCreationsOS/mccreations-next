'use client'

import Image from 'next/image';
import { ICreator } from '@/app/api/types';
import { getCreator } from '@/app/api/community';
import { Link } from "@/app/api/navigation";;
import styles from './CreatorCard.module.css';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCreator, useToken, useUser } from '@/app/api/hooks/users';
import { Plus, UserPlus } from 'lucide-react';
import { follow } from '@/app/api/creators';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';

/**
 * A card that displays a creator's logo and username
 * @param creator The creator to display 
 */
export default function CreatorCard({creator}: {creator: ICreator}) {
    const {creator: c, isLoading, error} = useCreator(creator.handle)
    const {user} = useUser()
    const {token} = useToken()
    const t = useTranslations()

    if(isLoading) return <div></div>
    if(error) return <div></div>

    const handleFollow = () => {
        follow(token, c!.handle!)
    }

    if(c && c.handle) {
        return (
            <div className='flex flex-row gap-2'>
                <Link className="flex-1 flex flex-row gap-2 items-center" href={`/creator/${c.handle}`}>
                    <Image src={c.iconURL ?? "/defaultLogo.png"} width={50} height={50} className="rounded-full w-[50px] h-[50px] object-cover" alt={t('Creator.logo_alt', {username: c.username})}></Image>
                    <div>
                        {c.username}
                    </div>
                </Link>
                {user && user.handle !== "" && !user.following?.includes(c.handle) && <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="secondary"><UserPlus /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <div className='flex flex-row gap-2 border-2 border-white/15'>
                            <DropdownMenuItem onClick={handleFollow}>Follow {c.username}</DropdownMenuItem>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
                
                // <DropDown buttonClassName={styles.follow_button} buttonLabel={<Plus />} className='option_dropdown' useButtonWidth={false}>
                //         <DropDownItem onClick={handleFollow} className='option_button'>Follow {c.username}</DropDownItem>
                //     </DropDown>
                }
            </div>
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