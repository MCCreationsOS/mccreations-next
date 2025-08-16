'use client'

import Image from 'next/image';
import { ICreator } from '@/app/api/types';
import { getCreator } from '@/app/api/community';
import { Link } from "@/i18n/navigation";;
import styles from './CreatorCard.module.css';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCreator, useToken, useUser } from '@/app/api/hooks/users';
import { Plus, UserPlus } from 'lucide-react';
import { follow } from '@/app/api/creators';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { CreatorAvatar } from '@/app/[locale]/create/formElements';

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
                    <CreatorAvatar creator={c} size={10} />
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
                            <DropdownMenuItem onClick={handleFollow}>{t('Pages.Creator.handle.follow')}</DropdownMenuItem>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
                }
            </div>
        )
    } else {
        return (
            <div className={"flex-1 flex flex-row gap-2 items-center"}>
                <CreatorAvatar creator={{username: creator.username, handle: creator.handle}} size={10} />
                <div>
                    {creator.username}
                </div>
            </div>
        )
    }
}