'use client'

import { ICreator } from '@/app/api/types';
import { Link } from "@/i18n/navigation";
import { useCreator, useUser } from '@/app/api/hooks/users';
import { CreatorAvatar } from '@/app/[locale]/create/formElements';
import SubscribeButton from '../ui/client_buttons/SubscribeButton';

/**
 * A card that displays a creator's logo and username
 * @param creator The creator to display 
 */
export default function CreatorCard({creator}: {creator: ICreator}) {
    const {creator: c, isLoading} = useCreator(creator.handle)
    const {user} = useUser()

    if(c && c.handle) {
        return (
            <div className='flex flex-row gap-2 items-center'>
                <Link className="flex-1 flex flex-row gap-2 items-center min-w-0" href={`/creator/${c.handle}`}>
                    <CreatorAvatar creator={c} size={10} />
                    <div className='truncate'>
                        {c.username}
                    </div>
                </Link>
                {user && <SubscribeButton handle={c.handle} size="sm" />}
            </div>
        )
    }

    // While loading, or for creators without a profile, show the name we already have
    return (
        <div className={`flex-1 flex flex-row gap-2 items-center ${isLoading ? 'opacity-70' : ''}`}>
            <CreatorAvatar creator={{username: creator.username, handle: creator.handle}} size={10} />
            <div>
                {creator.username}
            </div>
        </div>
    )
}
