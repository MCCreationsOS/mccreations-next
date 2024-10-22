"use client"

import { CollectionNames, SortOptions, StatusOptions, TagCategories, TagKeys } from "@/app/api/types";
import DropDown from "../FormInputs/RichText/DropDown";
import { useEffect, useState } from "react";
import { useTranslations } from "use-intl";
import styles from './index.module.css'
import { fetchTags } from "@/app/api/content";
import { useRouter, useSearchParams } from "next/navigation";

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
        <div className="sidebar_filters">
            <h3>{t('SearchAndFilter.sort_by')}</h3>
            <DropDown buttonClassName="options_dropdown_button" buttonLabel={t(`SearchAndFilter.Sort.${sort}`)}>
                <div className="option_dropdown">
                    <button onClick={() => setSort(SortOptions.Newest)} className="option_button">{t('SearchAndFilter.Sort.newest')}</button>
                    <button onClick={() => setSort(SortOptions.Oldest)} className="option_button">{t('SearchAndFilter.Sort.oldest')}</button>
                    <button onClick={() => setSort(SortOptions.Updated)} className="option_button">{t('SearchAndFilter.Sort.updated')}</button>
                    <button onClick={() => setSort(SortOptions.HighestRated)} className="option_button">{t('SearchAndFilter.Sort.highest_rated')}</button>
                    <button onClick={() => setSort(SortOptions.LowestRated)} className="option_button">{t('SearchAndFilter.Sort.lowest_rated')}</button>
                    <button onClick={() => setSort(SortOptions.HighestDownloads)} className="option_button">{t('SearchAndFilter.Sort.highest_downloads')}</button>
                    <button onClick={() => setSort(SortOptions.LowestDownloads)} className="option_button">{t('SearchAndFilter.Sort.lowest_downloads')}</button>
                    <button onClick={() => setSort(SortOptions.TitleAscending)} className="option_button">{t('SearchAndFilter.Sort.title_ascending')}</button>
                    <button onClick={() => setSort(SortOptions.TitleDescending)} className="option_button">{t('SearchAndFilter.Sort.title_descending')}</button>
                    <button onClick={() => setSort(SortOptions.CreatorAscending)} className="option_button">{t('SearchAndFilter.Sort.creator_ascending')}</button>
                    <button onClick={() => setSort(SortOptions.CreatorDescending)} className="option_button">{t('SearchAndFilter.Sort.creator_descending')}</button>
                </div>
            </DropDown>
            <h3>{t('SearchAndFilter.status')}</h3>
            <DropDown buttonClassName="options_dropdown_button" buttonLabel={t(`Status.${(StatusOptions[status] === "Unapproved") ? "unapproved" : (StatusOptions[status] === "Approved") ? "approved" : "featured"}`)}>
                <div className="option_dropdown">
                    <button onClick={() => {setStatus(StatusOptions.Unapproved)}} className="option_button">{t('Status.unapproved')}</button>
                    <button onClick={() => {setStatus(StatusOptions.Approved)}} className="option_button">{t('Status.approved')}</button>
                    <button onClick={() => {setStatus(StatusOptions.Featured)}} className="option_button">{t('Status.featured')}</button>
                </div>
            </DropDown>
            <div>
            <h3>{t('SearchAndFilter.tags')}</h3>
            <div className={styles.tags_list}>
                {tags && Object.keys(tags).map((category, idx) => {
                    return (
                    <div className="filter_option">
                        {t(`Content.Tags.${category as TagCategories}`)}
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
        </div>
    )
}