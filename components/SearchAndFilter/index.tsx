"use client"

import { CollectionNames, SortOptions, StatusOptions, StatusStrings, TagCategories, TagKeys, Tags } from "@/app/api/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Filter, Grid, List, Search } from "react-feather";
import styles from './index.module.css'
import WarningButton from "../Buttons/WarningButton";
import { fetchTags } from "@/app/api/content";
import IconButton from "../Buttons/IconButton";
import BulkDownloadButton from "../Buttons/BulkDownloadButton";
import {useTranslations} from 'next-intl';
import { useGridView } from "@/app/api/hooks/grids";

export default function SearchAndFilter({contentType, tags}: {contentType: CollectionNames, tags: {[key: string]: string[]}}) {
    const searchParams = useSearchParams()
    const [filtering, setFiltering] = useState(false);
    
    const [search, setSearch] = useState("")
    
    const [popupOpen, setPopupOpen] = useState(false)
    
    const [sortDropdown, setSortDropdown] = useState(false)
    const [sort, setSort] = useState<SortOptions>(SortOptions.Newest);
    
    const [statusDropdown, setStatusDropdown] = useState(false)
    const [status, setStatus] = useState(StatusOptions.Unapproved)
    
    const [openDropdowns, setOpenDropdowns] = useState<boolean[]>([])
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

    if(searchParams.get("search") && (!search || search.length == 0)) {
        setSearch(searchParams.get("search") + "")
    }
    if(searchParams.get("sort") && sort !== SortOptions.Newest) {
        setSort(searchParams.get("sort")! as SortOptions)
    }
    if(searchParams.get("status") && status !== StatusOptions.Unapproved) {
        setStatus(Number.parseInt(searchParams.get("status")!))
    }

    const Tag = ({tag, tagValue}: {tag: string, tagValue: string}) => {
        return (
            <div className={`${styles.tag} ${(includeTags.includes(tagValue)) ? styles.include : ""} ${(excludeTags.includes(tagValue)) ? styles.exclude : ""}`} onClick={() => {
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
            </div>
        )
    }

    const closePopups = () => {
        setSortDropdown(false);
        setStatusDropdown(false);
        setOpenDropdowns([])
        setPopupOpen(false)
    }

    // useEffect(() => {
    //     callback(search, sort, status);
    // }, [search, sort, status])

    const updateSearch = (search: string) => {
        setSearch(search);
        const params = new URLSearchParams(searchParams)
        params.set("search", search)
        router.push(`?${params.toString()}`)
        closePopups()
    }
    
    const updateSort = (sort: SortOptions) => {
        setSort(sort);
        const params = new URLSearchParams(searchParams)
        params.set("sort", sort)
        router.push(`?${params.toString()}`)
        closePopups()
    }
    
    const updateStatus = (status: StatusOptions) => {
        setStatus(status);
        const params = new URLSearchParams(searchParams)
        params.set("status", status.toString())
        router.push(`?${params.toString()}`)
        closePopups()
    }

    
    const performSearch = () => {
        console.log(search, sort, status, includeTags, excludeTags)
        const params = new URLSearchParams(searchParams)
        params.set("search", search)
        params.set("sort", sort)
        params.set("status", status.toString())
        params.set("includeTags", includeTags.join(","))
        params.set("excludeTags", excludeTags.join(","))
        router.push(`?${params.toString()}`)
        // router.refresh()
    }

    useEffect(() => {
        performSearch()
    }, [search, sort, status, includeTags, excludeTags])

    return (
        <div className="search_and_filter">
            <div className={styles.fullscreen} style={{display: (popupOpen) ? "block": "none"}} onClick={() => {(popupOpen == true) ? closePopups(): false}}></div>
                <div className="search_stack">
                    <input type="text" placeholder={t('SearchAndFilter.search_placeholder')} className="search" defaultValue={(search) ? search : ""} onChange={(e) => {setSearch(e.target.value)}} onKeyDown={(e) => (e.key === "Enter") ? performSearch() : false}></input>
                    <IconButton onClick={()=>{performSearch()}}><Search /></IconButton>
                    <IconButton className="filter" onClick={() => {setFiltering(!filtering)}}><Filter /></IconButton>
                    <div className="bulk_dl"><BulkDownloadButton /></div>
                    <IconButton className="secondary" onClick={() => {setGridView(gridView === "grid" ? "list" : "grid")}}>{(gridView === "grid") ? <List /> : <Grid />}</IconButton>
                </div>
                <div className={`filters ${filtering ? "filtering" : ""}`}>
                    <div className="filter_option">
                        {t('SearchAndFilter.sort_by')} 
                        <div className="select" onClick={() => {setSortDropdown(true); setPopupOpen(true)}}>
                            <button className="selected_option">{(sort) ? t(`SearchAndFilter.Sort.${sort}`) : t('SearchAndFilter.Sort.newest')}</button>
                            <div className={(sortDropdown) ? "options active" : "options"}>
                                <div className={(sort === SortOptions.Newest) ? "option selected": "option"} onClick={() => updateSort(SortOptions.Newest)}>{t('SearchAndFilter.Sort.newest')}</div>
                                <div className={(sort === SortOptions.Oldest) ? "option selected": "option"} onClick={() => updateSort(SortOptions.Oldest)}>{t('SearchAndFilter.Sort.oldest')}</div>
                                <div className={(sort === SortOptions.Updated) ? "option selected": "option"} onClick={() => updateSort(SortOptions.Updated)}>{t('SearchAndFilter.Sort.updated')}</div>
                                <div className={(sort === SortOptions.HighestRated) ? "option selected": "option"} onClick={() => updateSort(SortOptions.HighestRated)}>{t('SearchAndFilter.Sort.highest_rated')}</div>
                                <div className={(sort === SortOptions.LowestRated) ? "option selected": "option"} onClick={() => updateSort(SortOptions.LowestRated)}>{t('SearchAndFilter.Sort.lowest_rated')}</div>
                                <div className={(sort === SortOptions.HighestDownloads) ? "option selected": "option"} onClick={() => updateSort(SortOptions.HighestDownloads)}>{t('SearchAndFilter.Sort.highest_downloads')}</div>
                                <div className={(sort === SortOptions.LowestDownloads) ? "option selected": "option"} onClick={() => updateSort(SortOptions.LowestDownloads)}>{t('SearchAndFilter.Sort.lowest_downloads')}</div>
                                <div className={(sort === SortOptions.TitleAscending) ? "option selected": "option"} onClick={() => updateSort(SortOptions.TitleAscending)}>{t('SearchAndFilter.Sort.title_ascending')}</div>
                                <div className={(sort === SortOptions.TitleDescending) ? "option selected": "option"} onClick={() => updateSort(SortOptions.TitleDescending)}>{t('SearchAndFilter.Sort.title_descending')}</div>
                                <div className={(sort === SortOptions.CreatorAscending) ? "option selected": "option"} onClick={() => updateSort(SortOptions.CreatorAscending)}>{t('SearchAndFilter.Sort.creator_ascending')}</div>
                                <div className={(sort === SortOptions.CreatorDescending) ? "option selected": "option"} onClick={() => updateSort(SortOptions.CreatorDescending)}>{t('SearchAndFilter.Sort.creator_descending')}</div>
                            </div>
                        </div>
                    </div>
                    <div className="filter_option">
                        {t('SearchAndFilter.status')}
                        <div className="select" onClick={() => {setStatusDropdown(true); setPopupOpen(true)}}>
                            <button className="selected_option">{t(`Status.${(StatusOptions[status] === "Unapproved") ? "unapproved" : (StatusOptions[status] === "Approved") ? "approved" : "featured"}`)}</button>
                            <div className={(statusDropdown) ? "options active" : "options"}>
                                <div className={(status === StatusOptions.Unapproved) ? "option selected": "option"} onClick={() => updateStatus(StatusOptions.Unapproved)}>{t('Status.unapproved')}</div>
                                <div className={(status === StatusOptions.Approved) ? "option selected": "option"} onClick={() => updateStatus(StatusOptions.Approved)}>{t('Status.approved')}</div>
                                <div className={(status === StatusOptions.Featured) ? "option selected": "option"} onClick={() => updateStatus(StatusOptions.Featured)}>{t('Status.featured')}</div>
                            </div>
                        </div>
                    </div>
                        {tags && Object.keys(tags).map((category, idx) => {
                            return (
                                <div className="filter_option" key={category}>
                                    {t(`Content.Tags.${category as TagCategories}`)}
                                    <div key={category} className="select" onClick={() => {
                                        let newOpenDropdowns = [...openDropdowns]
                                        newOpenDropdowns[idx] = true
                                        setOpenDropdowns(newOpenDropdowns)
                                        setPopupOpen(true)}}>
                                        <button className="selected_option">{(tag_dropdown_names[category])}</button>
                                        <div className={(openDropdowns[idx]) ? `options active` : "options"}>
                                            <div className={styles.tags_list}>
                                                {tags[category].map((tag,idx) => <Tag key={tag} tagValue={tag} tag={t(`Content.Tags.${tag as TagKeys}`)} />)}
                                            </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    <div className="clear_filters">
                        <WarningButton onClick={() => {updateSearch(""); updateSort(SortOptions.Newest); updateStatus(2); setExcludeTags([]); setIncludeTags([])}}>{t('SearchAndFilter.clear_filters')}</WarningButton>
                    </div>
                </div>
        </div>
    )
}