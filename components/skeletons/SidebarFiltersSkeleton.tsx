import { getTranslations } from "next-intl/server";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';

export default async function SidebarFiltersSkeleton() {
    const t = await getTranslations()
    
    return (
        <div className="hidden @2xl:flex flex-col gap-2">
            <h3>{t('Components.Creations.Search.sort_by')}</h3>
            <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="secondary" className="w-full"><span className="w-full">{t(`Components.Creations.Search.Sort.newest`)}</span></Button></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <div className="flex flex-col gap-2 border-2 border-white/15 p-1">
                        <DropdownMenuItem>{t('Components.Creations.Search.Sort.newest')}</DropdownMenuItem>
                        <DropdownMenuItem>{t('Components.Creations.Search.Sort.oldest')}</DropdownMenuItem>
                        <DropdownMenuItem>{t('Components.Creations.Search.Sort.updated')}</DropdownMenuItem>
                        <DropdownMenuItem>{t('Components.Creations.Search.Sort.highest_rated')}</DropdownMenuItem>
                        <DropdownMenuItem>{t('Components.Creations.Search.Sort.lowest_rated')}</DropdownMenuItem>
                        <DropdownMenuItem>{t('Components.Creations.Search.Sort.highest_downloads')}</DropdownMenuItem>
                        <DropdownMenuItem>{t('Components.Creations.Search.Sort.lowest_downloads')}</DropdownMenuItem>
                        <DropdownMenuItem>{t('Components.Creations.Search.Sort.title_ascending')}</DropdownMenuItem>
                        <DropdownMenuItem>{t('Components.Creations.Search.Sort.title_descending')}</DropdownMenuItem>
                        <DropdownMenuItem>{t('Components.Creations.Search.Sort.creator_ascending')}</DropdownMenuItem>
                        <DropdownMenuItem>{t('Components.Creations.Search.Sort.creator_descending')}</DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
            <h3>{t('Components.Creations.Search.status')}</h3>
            <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="secondary" className="w-full"><span className="w-full">{t(`Components.Creations.Search.Status.unapproved`)}</span></Button></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <div className="flex flex-col gap-2 border-2 border-white/15 p-1">
                        <DropdownMenuItem>{t('Components.Creations.Search.Status.unapproved')}</DropdownMenuItem>
                        <DropdownMenuItem>{t('Components.Creations.Search.Status.approved')}</DropdownMenuItem>
                        <DropdownMenuItem>{t('Components.Creations.Search.Status.featured')}</DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}