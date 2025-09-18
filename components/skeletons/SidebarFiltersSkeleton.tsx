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
                        <DropdownMenuItem className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Sort.newest')}</Button></DropdownMenuItem>
                        <DropdownMenuItem className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Sort.oldest')}</Button></DropdownMenuItem>
                        <DropdownMenuItem className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Sort.updated')}</Button></DropdownMenuItem>
                        <DropdownMenuItem className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Sort.highest_rated')}</Button></DropdownMenuItem>
                        <DropdownMenuItem className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Sort.lowest_rated')}</Button></DropdownMenuItem>
                        <DropdownMenuItem className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Sort.highest_downloads')}</Button></DropdownMenuItem>
                        <DropdownMenuItem className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Sort.lowest_downloads')}</Button></DropdownMenuItem>
                        <DropdownMenuItem className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Sort.title_ascending')}</Button></DropdownMenuItem>
                        <DropdownMenuItem className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Sort.title_descending')}</Button></DropdownMenuItem>
                        <DropdownMenuItem className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Sort.creator_ascending')}</Button></DropdownMenuItem>
                        <DropdownMenuItem className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Sort.creator_descending')}</Button></DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
            <h3>{t('Components.Creations.Search.status')}</h3>
            <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="secondary" className="w-full"><span className="w-full">{t(`Components.Creations.Search.Status.unapproved`)}</span></Button></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <div className="flex flex-col gap-2 border-2 border-white/15 p-1">
                        <DropdownMenuItem className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Status.unapproved')}</Button></DropdownMenuItem>
                        <DropdownMenuItem className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Status.approved')}</Button></DropdownMenuItem>
                        <DropdownMenuItem className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Status.featured')}</Button></DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}