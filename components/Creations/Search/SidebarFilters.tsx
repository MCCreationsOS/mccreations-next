"use client"

import { CollectionNames, SortOptions, StatusOptions, TagCategories, TagKeys } from "@/app/api/types";
import { useEffect, useState } from "react";
import { useTranslations } from "use-intl";
import styles from './SearchBar.module.css'
import { useRouter, useSearchParams } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function SidebarFilters({contentType, tags, searchParams}: {contentType: CollectionNames, searchParams: { [key: string]: string | number }, tags: {[key: string]: string[]}}) {
    const t = useTranslations()
    const router = useRouter()
    const [sort, setSort] = useState<SortOptions>(searchParams.sort as SortOptions)
    const [status, setStatus] = useState<StatusOptions>(searchParams.status ? Number.parseInt(searchParams.status as string) : StatusOptions.Unapproved)
    const [includeTags, setIncludeTags] = useState<string[]>(searchParams.includeTags ? (searchParams.includeTags as string).split(",") : [])
    const [excludeTags, setExcludeTags] = useState<string[]>(searchParams.excludeTags ? (searchParams.excludeTags as string).split(",") : [])

    const Tag = ({tag, tagValue}: {tag: string, tagValue: string}) => {
        return (
            <button className={`${styles.tag} ${(includeTags.includes(tagValue)) ? styles.include : ""} ${(excludeTags.includes(tagValue)) ? styles.exclude : ""}`} onClick={() => {
                if(includeTags.includes(tagValue)) {
                    setIncludeTags(prev => prev.filter((t) => t != tagValue))
                    setExcludeTags(prev => [...prev, tagValue])
                } else if(excludeTags.includes(tagValue)) {
                    setExcludeTags(prev => prev.filter((t) => t != tagValue))
                } else {
                    setIncludeTags(prev => [...prev, tagValue])
                }
            }}>
                {tag}
            </button>
        )
    }

    useEffect(() => {
        performSearch()
    }, [sort, status, includeTags, excludeTags])

    const performSearch = () => {
        const params = new URLSearchParams(window.location.search)
        params.set("sort", sort)
        params.set("status", status.toString())
        params.set("includeTags", includeTags.join(","))
        params.set("excludeTags", excludeTags.join(","))
        router.push(`?${params.toString()}`);
        // router.refresh()
    }
    
    return (
        <div className="hidden @2xl:flex flex-col gap-2">
            <h3>{t('Components.Creations.Search.sort_by')}</h3>
            <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="secondary" className="w-full"><span className="w-full">{t(`Components.Creations.Search.Sort.${sort}`)}</span></Button></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <div className="flex flex-col gap-2 border-2 border-white/15 p-1">
                        <DropdownMenuItem onClick={() => setSort(SortOptions.Newest)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Sort.newest')}</Button></DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSort(SortOptions.Oldest)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Sort.oldest')}</Button></DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSort(SortOptions.Updated)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Sort.updated')}</Button></DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSort(SortOptions.HighestRated)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Sort.highest_rated')}</Button></DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSort(SortOptions.LowestRated)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Sort.lowest_rated')}</Button></DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSort(SortOptions.HighestDownloads)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Sort.highest_downloads')}</Button></DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSort(SortOptions.LowestDownloads)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Sort.lowest_downloads')}</Button></DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSort(SortOptions.TitleAscending)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Sort.title_ascending')}</Button></DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSort(SortOptions.TitleDescending)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Sort.title_descending')}</Button></DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSort(SortOptions.CreatorAscending)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Sort.creator_ascending')}</Button></DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSort(SortOptions.CreatorDescending)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Sort.creator_descending')}</Button></DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
            <h3>{t('Components.Creations.Search.status')}</h3>
            <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="secondary" className="w-full"><span className="w-full">{t(`Components.Creations.Search.Status.${(StatusOptions[status] === "Unapproved") ? "unapproved" : (StatusOptions[status] === "Approved") ? "approved" : "featured"}`)}</span></Button></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <div className="flex flex-col gap-2 border-2 border-white/15 p-1">
                        <DropdownMenuItem onClick={() => setStatus(StatusOptions.Unapproved)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Status.unapproved')}</Button></DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus(StatusOptions.Approved)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Status.approved')}</Button></DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus(StatusOptions.Featured)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Status.featured')}</Button></DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
            <div className={styles.tags_list}>
                {tags && Object.keys(tags).map((category, idx) => {
                    return (
                    <div className="filter_option" key={category}>
                        <h4>{t(`Components.Creations.Tags.${category as TagCategories}`)}</h4>
                        <div>
                            <div className={styles.tags_list}>
                                {tags[category].map((tag,idx) => <Tag key={tag} tagValue={tag} tag={t(`Components.Creations.Tags.${tag as TagKeys}`)} />)}
                            </div>
                        </div>
                    </div>
                    )
                })}
            </div>
        </div>
    )
}