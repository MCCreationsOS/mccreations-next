"use client"

import { CollectionNames, SortOptions, StatusOptions, TagCategories, TagKeys } from "@/app/api/types";
import { useEffect, useState } from "react";
import { useTranslations } from "use-intl";
import styles from './SearchBar.module.css'
import { useRouter, useSearchParams } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function SidebarFilters({contentType, tags}: {contentType: CollectionNames, tags: {[key: string]: string[]}}) {
    const t = useTranslations()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [sort, setSort] = useState<SortOptions>((searchParams.get("sort")) ? searchParams.get("sort")! as SortOptions : SortOptions.Newest)
    const [status, setStatus] = useState<StatusOptions>((searchParams.get("status")) ? Number.parseInt(searchParams.get("status")!) as StatusOptions : StatusOptions.Unapproved)
    const [includeTags, setIncludeTags] = useState<string[]>(searchParams.get("includeTags") ? searchParams.get("includeTags")!.split(",") : [])
    const [excludeTags, setExcludeTags] = useState<string[]>(searchParams.get("excludeTags") ? searchParams.get("excludeTags")!.split(",") : [])

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
        const params = new URLSearchParams(searchParams)
        params.set("sort", sort)
        params.set("status", status.toString())
        params.set("includeTags", includeTags.join(","))
        params.set("excludeTags", excludeTags.join(","))
        router.push(`?${params.toString()}`);
        // router.refresh()
    }
    
    return (
        <div className="hidden @2xl:flex flex-col gap-2">
            <h3>{t('SearchAndFilter.sort_by')}</h3>
            <DropdownMenu>
                <DropdownMenuTrigger><Button variant="secondary" className="w-full"><span className="w-full">{t(`SearchAndFilter.Sort.${sort}`)}</span></Button></DropdownMenuTrigger>
                <DropdownMenuContent className="border-2 border-white/15 p-1">
                    <DropdownMenuItem onClick={() => setSort(SortOptions.Newest)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('SearchAndFilter.Sort.newest')}</Button></DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSort(SortOptions.Oldest)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('SearchAndFilter.Sort.oldest')}</Button></DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSort(SortOptions.Updated)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('SearchAndFilter.Sort.updated')}</Button></DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSort(SortOptions.HighestRated)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('SearchAndFilter.Sort.highest_rated')}</Button></DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSort(SortOptions.LowestRated)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('SearchAndFilter.Sort.lowest_rated')}</Button></DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSort(SortOptions.HighestDownloads)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('SearchAndFilter.Sort.highest_downloads')}</Button></DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSort(SortOptions.LowestDownloads)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('SearchAndFilter.Sort.lowest_downloads')}</Button></DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSort(SortOptions.TitleAscending)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('SearchAndFilter.Sort.title_ascending')}</Button></DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSort(SortOptions.TitleDescending)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('SearchAndFilter.Sort.title_descending')}</Button></DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSort(SortOptions.CreatorAscending)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('SearchAndFilter.Sort.creator_ascending')}</Button></DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSort(SortOptions.CreatorDescending)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('SearchAndFilter.Sort.creator_descending')}</Button></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <h3>{t('SearchAndFilter.status')}</h3>
            <DropdownMenu>
                <DropdownMenuTrigger><Button variant="secondary" className="w-full"><span className="w-full">{t(`Status.${(StatusOptions[status] === "Unapproved") ? "unapproved" : (StatusOptions[status] === "Approved") ? "approved" : "featured"}`)}</span></Button></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <div className="flex flex-col gap-2 border-2 border-white/15 p-1">
                        <DropdownMenuItem onClick={() => setStatus(StatusOptions.Unapproved)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Status.unapproved')}</Button></DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus(StatusOptions.Approved)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Status.approved')}</Button></DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus(StatusOptions.Featured)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Status.featured')}</Button></DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
            <div className={styles.tags_list}>
                {tags && Object.keys(tags).map((category, idx) => {
                    return (
                    <div className="filter_option">
                        <h4>{t(`Content.Tags.${category as TagCategories}`)}</h4>
                        <div>
                            <div className={styles.tags_list}>
                                {tags[category].map((tag,idx) => <Tag key={tag} tagValue={tag} tag={t(`Content.Tags.${tag as TagKeys}`)} />)}
                            </div>
                        </div>
                    </div>
                    )
                })}
            </div>
        </div>
    )
}