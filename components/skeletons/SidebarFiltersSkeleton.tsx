import { getTranslations } from "next-intl/server";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';

export default async function SidebarFiltersSkeleton() {
    const t = await getTranslations()
    
    return (
        <div className="hidden @2xl:flex flex-col gap-2">
            <h3>{t('SearchAndFilter.sort_by')}</h3>
            <DropdownMenu>
                <DropdownMenuTrigger><Button variant="secondary" className="w-full"><span className="w-full">{t(`SearchAndFilter.Sort.newest`)}</span></Button></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <div className="flex flex-col gap-2 border-2 border-white/15 p-1">
                        <DropdownMenuItem className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('SearchAndFilter.Sort.newest')}</Button></DropdownMenuItem>
                        <DropdownMenuItem className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('SearchAndFilter.Sort.oldest')}</Button></DropdownMenuItem>
                        <DropdownMenuItem className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('SearchAndFilter.Sort.updated')}</Button></DropdownMenuItem>
                        <DropdownMenuItem className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('SearchAndFilter.Sort.highest_rated')}</Button></DropdownMenuItem>
                        <DropdownMenuItem className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('SearchAndFilter.Sort.lowest_rated')}</Button></DropdownMenuItem>
                        <DropdownMenuItem className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('SearchAndFilter.Sort.highest_downloads')}</Button></DropdownMenuItem>
                        <DropdownMenuItem className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('SearchAndFilter.Sort.lowest_downloads')}</Button></DropdownMenuItem>
                        <DropdownMenuItem className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('SearchAndFilter.Sort.title_ascending')}</Button></DropdownMenuItem>
                        <DropdownMenuItem className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('SearchAndFilter.Sort.title_descending')}</Button></DropdownMenuItem>
                        <DropdownMenuItem className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('SearchAndFilter.Sort.creator_ascending')}</Button></DropdownMenuItem>
                        <DropdownMenuItem className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('SearchAndFilter.Sort.creator_descending')}</Button></DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
            <h3>{t('SearchAndFilter.status')}</h3>
            <DropdownMenu>
                <DropdownMenuTrigger><Button variant="secondary" className="w-full"><span className="w-full">{t(`Status.unapproved`)}</span></Button></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <div className="flex flex-col gap-2 border-2 border-white/15 p-1">
                        <DropdownMenuItem className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Status.unapproved')}</Button></DropdownMenuItem>
                        <DropdownMenuItem className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Status.approved')}</Button></DropdownMenuItem>
                        <DropdownMenuItem className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Status.featured')}</Button></DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}