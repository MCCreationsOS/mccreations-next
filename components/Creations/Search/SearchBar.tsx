"use client"

import { SortOptions, StatusOptions, TagCategories, TagKeys } from "@/app/api/types";
import { useEffect, useRef, useState } from "react";
import {useTranslations} from 'next-intl';
import { useGridView } from "@/app/api/hooks/grids";
import { Button } from "@/components/ui/button";
import { Filter, Grid, List, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { statusLabelKey, useSearchFilters } from "./useSearchFilters";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import Tag from "./Tag";

const SEARCH_DEBOUNCE_MS = 400

export default function SearchAndFilter({searchParams, tags}: {searchParams: { [key: string]: string | number }, tags: {[key: string]: string[]}}) {
    const [filtering, setFiltering] = useState(false);
    const { filters, setFilters, toggleTag, clearFilters } = useSearchFilters(searchParams)
    const { search, sort, status, includeTags, excludeTags } = filters

    // The input is edited locally and written to the URL after a short pause (or on Enter / the search button),
    // instead of re-rendering the page and adding a history entry on every keystroke
    const [searchInput, setSearchInput] = useState(search)
    const lastSentSearch = useRef(search)
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const {gridView, setGridView} = useGridView()
    const t = useTranslations()

    // Pick up searches that change from outside this input (back/forward, clear filters)
    useEffect(() => {
        if (search !== lastSentSearch.current) {
            lastSentSearch.current = search
            setSearchInput(search)
        }
    }, [search])

    useEffect(() => {
        if (searchInput === lastSentSearch.current) return
        debounceTimer.current = setTimeout(() => {
            lastSentSearch.current = searchInput
            setFilters({ search: searchInput }, "replace")
        }, SEARCH_DEBOUNCE_MS)
        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current)
        }
    }, [searchInput, setFilters])

    const submitSearch = () => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current)
        lastSentSearch.current = searchInput
        setFilters({ search: searchInput })
    }

    let tag_dropdown_name = t('Components.Creations.Search.TagDropdown.any')
    if((includeTags.length > 0 || excludeTags.length > 0) && tags) {
        Object.keys(tags).forEach((category) => {
            tags[category].forEach((tag) => {
                if(includeTags.includes(tag)) {
                    if(tag_dropdown_name == t('Components.Creations.Search.TagDropdown.any')) {
                        tag_dropdown_name = t('Components.Creations.Search.TagDropdown.include_tag', {tag: t(`Components.Creations.Tags.${tag as TagKeys}`)})
                    } else {
                        tag_dropdown_name += ` ${t('Components.Creations.Search.TagDropdown.and')} ${t(`Components.Creations.Tags.${tag as TagKeys}`)}`
                    }
                }
            })

            tags[category].forEach((tag) => {
                if(excludeTags.includes(tag)) {
                    if(tag_dropdown_name == t('Components.Creations.Search.TagDropdown.any')) {
                        tag_dropdown_name = t('Components.Creations.Search.TagDropdown.exclude_tag', {tag: t(`Components.Creations.Tags.${tag as TagKeys}`)})
                    } else if(tag_dropdown_name.includes(t('Components.Creations.Search.TagDropdown.include')) && !tag_dropdown_name.includes(t('Components.Creations.Search.TagDropdown.exclude'))) {
                        tag_dropdown_name += t('Components.Creations.Search.TagDropdown.and_exclude', {tag: t(`Components.Creations.Tags.${tag as TagKeys}`)})
                    } else {
                        tag_dropdown_name += ` ${t('Components.Creations.Search.TagDropdown.and')} ${t(`Components.Creations.Tags.${tag as TagKeys}`)}`
                    }
                }
            })
        })
    }


    const sortOptions = [
        SortOptions.Newest, SortOptions.Oldest, SortOptions.Updated, SortOptions.HighestRated, SortOptions.LowestRated,
        SortOptions.HighestDownloads, SortOptions.LowestDownloads, SortOptions.TitleAscending, SortOptions.TitleDescending,
        SortOptions.CreatorAscending, SortOptions.CreatorDescending
    ]

    return (
        <div className="w-full max-w-screen-md mx-auto p-2">
                <div className="flex flex-row gap-2 w-full mb-2">
                    <Input type="text" placeholder={t('Components.Creations.Search.search_placeholder')} className="w-full" value={searchInput} onChange={(e) => {setSearchInput(e.target.value)}} onKeyDown={(e) => { if (e.key === "Enter") submitSearch() }}></Input>
                    <Button onClick={submitSearch}><Search /></Button>
                    <Button className="filter md:hidden" onClick={() => {setFiltering(!filtering)}}><Filter /></Button>
                    {/* <BulkDownloadButton /> */}
                    <Button variant="secondary" onClick={() => {setGridView(gridView === "grid" ? "list" : "grid")}}>{(gridView === "grid") ? <List /> : <Grid />}</Button>
                </div>
                <div className={`flex gap-2 flex-wrap items-end overflow-hidden ${filtering ? "" : "hidden"}`}>
                    <div>
                        <DropdownMenu>
                            <DropdownMenuLabel >{t('Components.Creations.Search.sort_by')}</DropdownMenuLabel>
                            <DropdownMenuTrigger asChild><Button variant="secondary"><span className="w-31">{t(`Components.Creations.Search.Sort.${sort}`)}</span></Button></DropdownMenuTrigger>
                            <DropdownMenuContent >
                                <div className="flex flex-col gap-2 border-2 border-white/15 p-1">
                                    {sortOptions.map((option) => (
                                        <DropdownMenuItem key={option} onSelect={() => setFilters({ sort: option })}>{t(`Components.Creations.Search.Sort.${option}`)}</DropdownMenuItem>
                                    ))}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div>
                        <DropdownMenu>
                            <DropdownMenuLabel>{t('Components.Creations.Search.status')}</DropdownMenuLabel>
                            <DropdownMenuTrigger asChild><Button variant="secondary"><span className="w-31">{t(`Components.Creations.Search.Status.${statusLabelKey(status)}`)}</span></Button></DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <div className="flex flex-col gap-2 border-2 border-white/15 p-1">
                                    <DropdownMenuItem onSelect={() => setFilters({ status: StatusOptions.Unapproved })}>{t('Components.Creations.Search.Status.unapproved')}</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => setFilters({ status: StatusOptions.Approved })}>{t('Components.Creations.Search.Status.approved')}</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => setFilters({ status: StatusOptions.Featured })}>{t('Components.Creations.Search.Status.featured')}</DropdownMenuItem>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div>
                        <Label className="px-2 py-1.5 text-sm font-semibold">{t('Components.Creations.Search.tags')}</Label>
                        <Popover>
                            <PopoverTrigger asChild><Button variant="secondary"><span className="w-31">{tag_dropdown_name}</span></Button></PopoverTrigger>
                            <PopoverContent className="p-1 max-h-[500px] overflow-y-auto">
                                {Object.keys(tags).map((category) => (
                                    <div key={category} className="p-1 pb-3">
                                        <h4>{t(`Components.Creations.Tags.${category as TagCategories}`)}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {tags[category].map((tag) => (
                                                <Tag key={tag} tagValue={tag} tag={t(`Components.Creations.Tags.${tag as TagKeys}`)} includeTags={includeTags} excludeTags={excludeTags} toggleTag={toggleTag} />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </PopoverContent>
                        </Popover>
                    </div>
                    {/* {tags && Object.keys(tags).map((category) => {
                        return (
                            <div key={category}>
                                <DropdownMenu>
                                    <DropdownMenuLabel>{t(`Components.Creations.Tags.${category as TagCategories}`)}</DropdownMenuLabel>
                                    <DropdownMenuTrigger asChild><Button variant="secondary"><span className="w-31">{tag_dropdown_names[category]}</span></Button></DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <div className="flex flex-col gap-2 border-2 border-white/15 p-1">
                                            {tags[category].map((tag) => <DropdownMenuItem key={tag} onSelect={() => toggleTag(tag)}>{t(`Components.Creations.Tags.${tag as TagKeys}`)}</DropdownMenuItem>)}
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )
                    })} */}
                    <div className="clear_filters">
                        <Button variant="destructive" onClick={clearFilters}><span className="w-31">{t('Components.Creations.Search.clear_filters')}</span></Button>
                    </div>
            </div>
        </div>
    )
}
