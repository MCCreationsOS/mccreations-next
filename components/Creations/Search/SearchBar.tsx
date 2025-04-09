"use client"

import { CollectionNames, SortOptions, StatusOptions, StatusStrings, TagCategories, TagKeys, Tags } from "@/app/api/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from './SearchBar.module.css'
import {useTranslations} from 'next-intl';
import { useGridView } from "@/app/api/hooks/grids";
import { Button } from "@/components/ui/button";
import BulkDownloadButton from "@/components/ui/client_buttons/BulkDownloadButton";
import { Filter, Grid, List, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

export default function SearchAndFilter({searchParams, tags}: {searchParams: {page: string, search: string, sort: string, status: string, includeTags: string, excludeTags: string}, tags: {[key: string]: string[]}}) {
    const [filtering, setFiltering] = useState(false);
    
    const [search, setSearch] = useState("")
    const [sort, setSort] = useState<SortOptions>(SortOptions.Newest);
    const [status, setStatus] = useState(StatusOptions.Unapproved)
    
    const [includeTags, setIncludeTags] = useState<string[]>([])
    const [excludeTags, setExcludeTags] = useState<string[]>([])

    const {gridView, setGridView} = useGridView()
    
    const router = useRouter();
    const t = useTranslations()

    let tag_dropdown_names: {[key: string]: string} = {
        genre: "Any",
        subgenre: "Any",
        difficulty: "Any",
        length: "Any",
        theme: "Any",
        resolution: "Any",
    }

    if((includeTags.length > 0 || excludeTags.length > 0) && tags) {
        Object.keys(tags).forEach((category) => {
            tags[category].forEach((tag) => {
                if(includeTags.includes(tag)) {
                    if(tag_dropdown_names[category] == "Any") {
                        tag_dropdown_names[category] = `Include ${t(`Content.Tags.${tag as TagKeys}`)}`
                    } else {
                        tag_dropdown_names[category] += ` & ${t(`Content.Tags.${tag as TagKeys}`)}`
                    }
                }
            })

            tags[category].forEach((tag) => {
                if(excludeTags.includes(tag)) {
                    if(tag_dropdown_names[category] == "Any") {
                        tag_dropdown_names[category] = `Exclude ${t(`Content.Tags.${tag as TagKeys}`)}`
                    } else if(tag_dropdown_names[category].includes("Include") && !tag_dropdown_names[category].includes("exclude")) {
                        tag_dropdown_names[category] += ` and exclude ${t(`Content.Tags.${tag as TagKeys}`)}`
                    } else {
                        tag_dropdown_names[category] += ` & ${t(`Content.Tags.${tag as TagKeys}`)}`
                    }
                }
            })
        })
    }

    useEffect(() => {
        if(searchParams.search && (!search || search.length == 0)) {
            setSearch(searchParams.search)
        }
        if(searchParams.sort && sort !== SortOptions.Newest) {
            setSort(searchParams.sort as SortOptions)
        }
        if(searchParams.status && status !== StatusOptions.Unapproved) {
            setStatus(Number.parseInt(searchParams.status))
        }
    }, [])
    
    const performSearch = () => {
        console.log(search, sort, status, includeTags, excludeTags)
        const params = new URLSearchParams(searchParams)
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
                    <Input type="text" placeholder={t('SearchAndFilter.search_placeholder')} className="w-full" defaultValue={(search) ? search : ""} onChange={(e) => {setSearch(e.target.value)}} onKeyDown={(e) => (e.key === "Enter") ? performSearch() : false}></Input>
                    <Button onClick={()=>{performSearch()}}><Search /></Button>
                    <Button className="filter md:hidden" onClick={() => {setFiltering(!filtering)}}><Filter /></Button>
                    {/* <BulkDownloadButton /> */}
                    <Button variant="secondary" onClick={() => {setGridView(gridView === "grid" ? "list" : "grid")}}>{(gridView === "grid") ? <List /> : <Grid />}</Button>
                </div>
                <div className={`flex gap-2 flex-wrap items-end overflow-hidden ${filtering ? "" : "hidden"}`}>
                    <div>
                        <DropdownMenu>
                            <DropdownMenuLabel >{t('SearchAndFilter.sort_by')}</DropdownMenuLabel>
                            <DropdownMenuTrigger><Button variant="secondary"><span className="w-31">{t(`SearchAndFilter.Sort.${sort}`)}</span></Button></DropdownMenuTrigger>
                            <DropdownMenuContent >
                                <div className="flex flex-col gap-2 border-2 border-white/15 p-1">
                                    <DropdownMenuItem onClick={() => setSort(SortOptions.Newest)} className="hover:bg-black/70 px-2 py-1 text-sm transition-all duration-200">{t('SearchAndFilter.Sort.newest')}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSort(SortOptions.Oldest)} className="hover:bg-black/70 px-2 py-1 text-sm transition-all duration-200">{t('SearchAndFilter.Sort.oldest')}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSort(SortOptions.Updated)} className="hover:bg-black/70 px-2 py-1 text-sm transition-all duration-200">{t('SearchAndFilter.Sort.updated')}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSort(SortOptions.HighestRated)} className="hover:bg-black/70 px-2 py-1 text-sm transition-all duration-200">{t('SearchAndFilter.Sort.highest_rated')}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSort(SortOptions.LowestRated)} className="hover:bg-black/70 px-2 py-1 text-sm transition-all duration-200">{t('SearchAndFilter.Sort.lowest_rated')}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSort(SortOptions.HighestDownloads)} className="hover:bg-black/70 px-2 py-1 text-sm transition-all duration-200">{t('SearchAndFilter.Sort.highest_downloads')}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSort(SortOptions.LowestDownloads)} className="hover:bg-black/70 px-2 py-1 text-sm transition-all duration-200">{t('SearchAndFilter.Sort.lowest_downloads')}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSort(SortOptions.TitleAscending)} className="hover:bg-black/70 px-2 py-1 text-sm transition-all duration-200">{t('SearchAndFilter.Sort.title_ascending')}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSort(SortOptions.TitleDescending)} className="hover:bg-black/70 px-2 py-1 text-sm transition-all duration-200">{t('SearchAndFilter.Sort.title_descending')}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSort(SortOptions.CreatorAscending)} className="hover:bg-black/70 px-2 py-1 text-sm transition-all duration-200">{t('SearchAndFilter.Sort.creator_ascending')}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSort(SortOptions.CreatorDescending)} className="hover:bg-black/70 px-2 py-1 text-sm transition-all duration-200">{t('SearchAndFilter.Sort.creator_descending')}</DropdownMenuItem>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div>
                        <DropdownMenu>
                            <DropdownMenuLabel>{t('SearchAndFilter.status')}</DropdownMenuLabel>
                            <DropdownMenuTrigger><Button variant="secondary"><span className="w-31">{t(`Status.${(StatusOptions[status] === "Unapproved") ? "unapproved" : (StatusOptions[status] === "Approved") ? "approved" : "featured"}`)}</span></Button></DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <div className="flex flex-col gap-2 border-2 border-white/15 p-1">
                                    <DropdownMenuItem onClick={() => setStatus(StatusOptions.Unapproved)} className="hover:bg-black/70 px-2 py-1 text-sm transition-all duration-200">{t('Status.unapproved')}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatus(StatusOptions.Approved)} className="hover:bg-black/70 px-2 py-1 text-sm transition-all duration-200">{t('Status.approved')}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatus(StatusOptions.Featured)} className="hover:bg-black/70 px-2 py-1 text-sm transition-all duration-200">{t('Status.featured')}</DropdownMenuItem>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    {tags && Object.keys(tags).map((category, idx) => {
                        return (
                            <div>
                                <DropdownMenu>
                                    <DropdownMenuLabel>{t(`Content.Tags.${category as TagCategories}`)}</DropdownMenuLabel>
                                    <DropdownMenuTrigger><Button variant="secondary"><span className="w-31">{tag_dropdown_names[category]}</span></Button></DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <div className="flex flex-col gap-2 border-2 border-white/15 p-1">
                                            {tags[category].map((tag) => <DropdownMenuItem key={tag} onClick={() => {
                                                if(includeTags.includes(tag)) {
                                                    setIncludeTags(prev => prev.filter((t) => t != tag))
                                                    setExcludeTags(prev => [...prev, tag])
                                                }
                                            }} className="hover:bg-black/70 px-2 py-1 text-sm transition-all duration-200">{t(`Content.Tags.${tag as TagKeys}`)}</DropdownMenuItem>)}
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )
                    })}
                    <div className="clear_filters">
                        <Button variant="destructive" onClick={() => {setSearch(""); setSort(SortOptions.Newest); setStatus(StatusOptions.Unapproved); setExcludeTags([]); setIncludeTags([])}}><span className="w-31">{t('SearchAndFilter.clear_filters')}</span></Button>
                    </div>
            </div>
        </div>
    )
}