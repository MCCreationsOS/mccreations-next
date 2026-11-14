"use client"

import { CollectionNames, SortOptions, StatusOptions, TagCategories, TagKeys } from "@/app/api/types";
import { useTranslations } from "use-intl";
import styles from './SearchBar.module.css'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { statusLabelKey, useSearchFilters } from "./useSearchFilters";
import Tag from "./Tag";

export default function SidebarFilters({contentType, tags, searchParams}: {contentType: CollectionNames, searchParams: { [key: string]: string | number }, tags: {[key: string]: string[]}}) {
    const t = useTranslations()
    // Shares its state with the search bar through the URL, so the two never disagree
    const { filters, setFilters, toggleTag } = useSearchFilters(searchParams)
    const { sort, status, includeTags, excludeTags } = filters

    const sortOptions = [
        SortOptions.Newest, SortOptions.Oldest, SortOptions.Updated, SortOptions.HighestRated, SortOptions.LowestRated,
        SortOptions.HighestDownloads, SortOptions.LowestDownloads, SortOptions.TitleAscending, SortOptions.TitleDescending,
        SortOptions.CreatorAscending, SortOptions.CreatorDescending
    ]

    return (
        <div className="hidden @2xl:flex flex-col gap-2">
            <h3>{t('Components.Creations.Search.sort_by')}</h3>
            <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="secondary" className="w-full"><span className="w-full">{t(`Components.Creations.Search.Sort.${sort}`)}</span></Button></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <div className="flex flex-col gap-2 border-2 border-white/15 p-1">
                        {sortOptions.map((option) => (
                            <DropdownMenuItem key={option} onSelect={() => setFilters({ sort: option })}>{t(`Components.Creations.Search.Sort.${option}`)}</DropdownMenuItem>
                        ))}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
            <h3>{t('Components.Creations.Search.status')}</h3>
            <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="secondary" className="w-full"><span className="w-full">{t(`Components.Creations.Search.Status.${statusLabelKey(status)}`)}</span></Button></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <div className="flex flex-col gap-2 border-2 border-white/15 p-1">
                        <DropdownMenuItem onSelect={() => setFilters({ status: StatusOptions.Unapproved })}>{t('Components.Creations.Search.Status.unapproved')}</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setFilters({ status: StatusOptions.Approved })}>{t('Components.Creations.Search.Status.approved')}</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setFilters({ status: StatusOptions.Featured })}>{t('Components.Creations.Search.Status.featured')}</DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
            <div className={styles.tags_list}>
                {tags && Object.keys(tags).map((category) => {
                    return (
                    <div className="filter_option" key={category}>
                        <h4>{t(`Components.Creations.Tags.${category as TagCategories}`)}</h4>
                        <div>
                            <div className={styles.tags_list}>
                                {tags[category].map((tag) => <Tag key={tag} tagValue={tag} tag={t(`Components.Creations.Tags.${tag as TagKeys}`)} includeTags={includeTags} excludeTags={excludeTags} toggleTag={toggleTag} />)}
                            </div>
                        </div>
                    </div>
                    )
                })}
            </div>
        </div>
    )
}
