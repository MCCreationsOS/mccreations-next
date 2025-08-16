"use client"

import { CollectionNames, SortOptions, StatusOptions, StatusStrings, TagCategories, TagKeys, Tags } from "@/app/api/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from './SearchBar.module.css'
import {useTranslations} from 'next-intl';
import { useGridView } from "@/app/api/hooks/grids";
import { Button } from "@/components/ui/button";
import { Filter, Grid, List, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

export default function SearchAndFilter({searchParams, tags}: {searchParams: { [key: string]: string | number }, tags: {[key: string]: string[]}}) {
    const [filtering, setFiltering] = useState(false);
    
    const [search, setSearch] = useState(searchParams.search as string)
    const [sort, setSort] = useState<SortOptions>(searchParams.sort as SortOptions)
    const [status, setStatus] = useState(searchParams.status ? Number.parseInt(searchParams.status as string) : StatusOptions.Unapproved)
    
    const [includeTags, setIncludeTags] = useState<string[]>([])
    const [excludeTags, setExcludeTags] = useState<string[]>([])

    const {gridView, setGridView} = useGridView()
    
    const router = useRouter();
    const t = useTranslations()

    let tag_dropdown_names: {[key: string]: string} = {
        genre: t('Components.Creations.Search.TagDropdown.any'),
        subgenre: t('Components.Creations.Search.TagDropdown.any'),
        difficulty: t('Components.Creations.Search.TagDropdown.any'),
        length: t('Components.Creations.Search.TagDropdown.any'),
        theme: t('Components.Creations.Search.TagDropdown.any'),
        resolution: t('Components.Creations.Search.TagDropdown.any'),
    }

    if((includeTags.length > 0 || excludeTags.length > 0) && tags) {
        Object.keys(tags).forEach((category) => {
            tags[category].forEach((tag) => {
                if(includeTags.includes(tag)) {
                    if(tag_dropdown_names[category] == t('Components.Creations.Search.TagDropdown.any')) {
                        tag_dropdown_names[category] = t('Components.Creations.Search.TagDropdown.include_tag', {tag: t(`Components.Creations.Tags.${tag as TagKeys}`)})
                    } else {
                        tag_dropdown_names[category] += ` ${t('Components.Creations.Search.TagDropdown.and')} ${t(`Components.Creations.Tags.${tag as TagKeys}`)}`
                    }
                }
            })

            tags[category].forEach((tag) => {
                if(excludeTags.includes(tag)) {
                    if(tag_dropdown_names[category] == t('Components.Creations.Search.TagDropdown.any')) {
                        tag_dropdown_names[category] = t('Components.Creations.Search.TagDropdown.exclude_tag', {tag: t(`Components.Creations.Tags.${tag as TagKeys}`)})
                    } else if(tag_dropdown_names[category].includes(t('Components.Creations.Search.TagDropdown.include')) && !tag_dropdown_names[category].includes(t('Components.Creations.Search.TagDropdown.exclude'))) {
                        tag_dropdown_names[category] += t('Components.Creations.Search.TagDropdown.and_exclude', {tag: t(`Components.Creations.Tags.${tag as TagKeys}`)})
                    } else {
                        tag_dropdown_names[category] += ` ${t('Components.Creations.Search.TagDropdown.and')} ${t(`Components.Creations.Tags.${tag as TagKeys}`)}`
                    }
                }
            })
        })
    }

    const performSearch = () => {
        const params = new URLSearchParams(window.location.search)
        params.set("search", search)
        params.set("sort", sort)
        params.set("status", status.toString())
        params.set("includeTags", includeTags.join(","))
        params.set("excludeTags", excludeTags.join(","))
        router.push(`?${params.toString()}`)
    }

    useEffect(() => {
        performSearch()
    }, [search, sort, status, includeTags, excludeTags])

    return (
        <div className="w-full max-w-screen-md mx-auto p-2">
                <div className="flex flex-row gap-2 w-full mb-2">
                    <Input type="text" placeholder={t('Components.Creations.Search.search_placeholder')} className="w-full" defaultValue={(search) ? search : ""} onChange={(e) => {setSearch(e.target.value)}} onKeyDown={(e) => (e.key === "Enter") ? performSearch() : false}></Input>
                    <Button onClick={()=>{performSearch()}}><Search /></Button>
                    <Button className="filter md:hidden" onClick={() => {setFiltering(!filtering)}}><Filter /></Button>
                    {/* <BulkDownloadButton /> */}
                    <Button variant="secondary" onClick={() => {setGridView(gridView === "grid" ? "list" : "grid")}}>{(gridView === "grid") ? <List /> : <Grid />}</Button>
                </div>
                <div className={`flex gap-2 flex-wrap items-end overflow-hidden ${filtering ? "" : "hidden"}`}>
                    <div>
                        <DropdownMenu>
                            <DropdownMenuLabel >{t('Components.Creations.Search.sort_by')}</DropdownMenuLabel>
                            <DropdownMenuTrigger><Button variant="secondary"><span className="w-31">{t(`Components.Creations.Search.Sort.${sort}`)}</span></Button></DropdownMenuTrigger>
                            <DropdownMenuContent >
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
                    </div>
                    <div>
                        <DropdownMenu>
                            <DropdownMenuLabel>{t('Components.Creations.Search.status')}</DropdownMenuLabel>
                            <DropdownMenuTrigger><Button variant="secondary"><span className="w-31">{t(`Components.Creations.Search.Status.${(StatusOptions[status] === "Unapproved") ? "unapproved" : (StatusOptions[status] === "Approved") ? "approved" : "featured"}`)}</span></Button></DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <div className="flex flex-col gap-2 border-2 border-white/15 p-1">
                                    <DropdownMenuItem onClick={() => setStatus(StatusOptions.Unapproved)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Status.unapproved')}</Button></DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatus(StatusOptions.Approved)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Status.approved')}</Button></DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatus(StatusOptions.Featured)} className="p-0"><Button variant="ghost" className="m-0 p-1 h-full w-full">{t('Components.Creations.Search.Status.featured')}</Button></DropdownMenuItem>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    {tags && Object.keys(tags).map((category, idx) => {
                        return (
                            <div key={category}>
                                <DropdownMenu>
                                    <DropdownMenuLabel>{t(`Components.Creations.Tags.${category as TagCategories}`)}</DropdownMenuLabel>
                                    <DropdownMenuTrigger><Button variant="secondary"><span className="w-31">{tag_dropdown_names[category]}</span></Button></DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <div className="flex flex-col gap-2 border-2 border-white/15 p-1">
                                            {tags[category].map((tag) => <DropdownMenuItem key={tag} onClick={() => {
                                                if(includeTags.includes(tag)) {
                                                    setIncludeTags(prev => prev.filter((t) => t != tag))
                                                    setExcludeTags(prev => [...prev, tag])
                                                }
                                            }} className="p-0"><Button onClick={() => {
                                                if(includeTags.includes(tag)) {
                                                    setIncludeTags(prev => prev.filter((t) => t != tag))
                                                    setExcludeTags(prev => [...prev, tag])
                                                } else if(excludeTags.includes(tag)) {
                                                    setExcludeTags(prev => prev.filter((t) => t != tag))
                                                } else {
                                                    setIncludeTags(prev => [...prev, tag])
                                                }
                                            }} variant="ghost" className="m-0 p-1 h-full w-full">{t(`Components.Creations.Tags.${tag as TagKeys}`)}</Button></DropdownMenuItem>)}
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )
                    })}
                    <div className="clear_filters">
                        <Button variant="destructive" onClick={() => {setSearch(""); setSort(SortOptions.Newest); setStatus(StatusOptions.Unapproved); setExcludeTags([]); setIncludeTags([])}}><span className="w-31">{t('Components.Creations.Search.clear_filters')}</span></Button>
                    </div>
            </div>
        </div>
    )
}