import { ContentTypes, MinecraftVersion, SortOptions, StatusOptions, Tags } from "@/app/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Filter } from "react-feather";
import SecondaryButton from "../Buttons/SecondaryButton";
import styles from './index.module.css'
import MainButton from "../Buttons/MainButton";
import WarningButton from "../Buttons/WarningButton";
import FormComponent from "../Form/Form";
import { fetchTags } from "@/app/api/content";

export default function SearchAndFilter({callback, contentType}: {callback: Function, contentType: ContentTypes}) {
    const searchParams = useSearchParams()
    const [filtering, setFiltering] = useState(false);
    const [tags, setTags] = useState()

    const [search, setSearch] = useState("")

    const [popupOpen, setPopupOpen] = useState(false)

    const [sortDropdown, setSortDropdown] = useState(false)
    const [sort, setSort] = useState<SortOptions>();

    const [statusDropdown, setStatusDropdown] = useState(false)
    const [status, setStatus] = useState(StatusOptions.Approved)

    const [tagsDropdown, setTagsDropdown] = useState(false)
    const [includeTags, setIncludeTags] = useState<string[]>([])
    const [excludeTags, setExcludeTags] = useState<string[]>([])

    const router = useRouter();

    useEffect(() => {

        fetchTags(contentType).then((data) => {
            if('genre' in data) {
                setTags(data)
            }
        })

        if(searchParams.get("search") && searchParams.get("search") != search) {
            setSearch(searchParams.get("search") + "")
        }
        if(searchParams.get("sort") && searchParams.get("sort") != sort) {
            setSort(searchParams.get("sort")! as SortOptions)
        }
        if(searchParams.get("status")&& Number.parseInt(searchParams.get("status")!) != status) {
            setStatus(Number.parseInt(searchParams.get("status")!))
        }

    }, [])

    const Tag = ({tag}: {tag: string}) => {
        return (
            <div className={`${styles.tag} ${(includeTags.includes(tag)) ? styles.include : ""} ${(excludeTags.includes(tag)) ? styles.exclude : ""}`} onClick={() => {
                if(includeTags.includes(tag)) {
                    console.log('excluding tag ' + tag)
                    setIncludeTags(includeTags.filter((t) => t != tag))
                    setExcludeTags([...excludeTags, tag])
                } else if(excludeTags.includes(tag)) {
                    console.log('removing tag ' + tag)
                    setExcludeTags(excludeTags.filter((t) => t != tag))
                } else {
                    console.log('including tag ' + tag)
                    setIncludeTags([...includeTags, tag])
                }
            }}>
                {tag.charAt(0).toUpperCase() + tag.substring(1)}
            </div>
        )
    }

    const closePopups = () => {
        setSortDropdown(false);
        setStatusDropdown(false);
        setTagsDropdown(false);
        setPopupOpen(false)
    }

    // useEffect(() => {
    //     callback(search, sort, status);
    // }, [search, sort, status])

    const updateSearch = (search: string) => {
        setSearch(search);
        router.push(`?search=${search}&sort=${sort}&status=${status}&include=${includeTags.join(",")}&exclude=${excludeTags.join(",")}`)
    }

    const updateSort = (sort: SortOptions) => {
        router.push(`?search=${search}&sort=${sort}&status=${status}&include=${includeTags.join(",")}&exclude=${excludeTags.join(",")}`)
        setSort(sort);
    }

    const updateStatus = (stats: StatusOptions) => {
        router.push(`?search=${search}&sort=${sort}&status=${status}&include=${includeTags.join(",")}&exclude=${excludeTags.join(",")}`)
        setStatus(status);
    }

    const updateTags = () => {
        router.push(`?search=${search}&sort=${sort}&status=${status}&include=${includeTags.join(",")}&exclude=${excludeTags.join(",")}`)
    }

    const performSearch = () => {
        updateSearch(search);
        updateSort(sort!);
        updateStatus(status!);
        updateTags();
        callback(search, sort, status, includeTags, excludeTags);
    }

    return (
        <div className="search_and_filter">
            <div className={styles.fullscreen} style={{display: (popupOpen) ? "block": "none"}} onClick={() => {(popupOpen == true) ? closePopups(): false}}></div>
                <div className="search_stack">
                    <input type="text" placeholder="Search title, creator, version, etc." className="search" defaultValue={(search) ? search : ""} onChange={(e) => {setSearch(e.target.value)}} onKeyDown={(e) => (e.key === "Enter") ? performSearch() : false}></input>
                    <SecondaryButton onClick={() => setFiltering(!filtering)}><Filter /></SecondaryButton>
                </div>
                <div className="filters" style={{display: (filtering) ? "flex": "none"}}>
                    <div className="filter_option">
                        Sort by 
                        <div className="select" onClick={() => {setSortDropdown(true); setPopupOpen(true)}}>
                            <button className="selected_option">{(sort) ? sort.charAt(0).toUpperCase() + sort.replaceAll("_", " ").substring(1) : "Newest"}</button>
                            <div className={(sortDropdown) ? "options active" : "options"}>
                                <div className={(sort === SortOptions.Newest) ? "option selected": "option"} onClick={() => updateSort(SortOptions.Newest)}>Newest</div>
                                <div className={(sort === SortOptions.Oldest) ? "option selected": "option"} onClick={() => updateSort(SortOptions.Oldest)}>Oldest</div>
                                <div className={(sort === SortOptions.Updated) ? "option selected": "option"} onClick={() => updateSort(SortOptions.Updated)}>Updated</div>
                                <div className={(sort === SortOptions.TitleAscending) ? "option selected": "option"} onClick={() => updateSort(SortOptions.TitleAscending)}>Title Ascending</div>
                                <div className={(sort === SortOptions.TitleDescending) ? "option selected": "option"} onClick={() => updateSort(SortOptions.TitleDescending)}>Title Descending</div>
                                <div className={(sort === SortOptions.CreatorAscending) ? "option selected": "option"} onClick={() => updateSort(SortOptions.CreatorAscending)}>Creator Ascending</div>
                                <div className={(sort === SortOptions.CreatorDescending) ? "option selected": "option"} onClick={() => updateSort(SortOptions.CreatorDescending)}>Creator Descending</div>
                                <div className={(sort === SortOptions.HighestRated) ? "option selected": "option"} onClick={() => updateSort(SortOptions.HighestRated)}>Highest Rated</div>
                                <div className={(sort === SortOptions.LowestRated) ? "option selected": "option"} onClick={() => updateSort(SortOptions.LowestRated)}>Lowest Rated</div>
                                {/* <div className="option" onClick={() => setSort(SortOptions.BestMatch)}>Best Match</div> */}
                            </div>
                        </div>
                    </div>
                    <div className="filter_option">
                        Status
                        <div className="select" onClick={() => {setStatusDropdown(true); setPopupOpen(true)}}>
                            <button className="selected_option">{StatusOptions[status]}</button>
                            <div className={(statusDropdown) ? "options active" : "options"}>
                                <div className={(status === StatusOptions.Unapproved) ? "option selected": "option"} onClick={() => updateStatus(StatusOptions.Unapproved)}>Unapproved</div>
                                <div className={(status === StatusOptions.Approved) ? "option selected": "option"} onClick={() => updateStatus(StatusOptions.Approved)}>Approved</div>
                                <div className={(status === StatusOptions.Featured) ? "option selected": "option"} onClick={() => updateStatus(StatusOptions.Featured)}>Featured</div>
                            </div>
                        </div>
                    </div>
                    <div className="filter_option">
                        Tags
                        <div className="select" onClick={() => {setTagsDropdown(true); setPopupOpen(true)}}>
                            <button className="selected_option">Tags</button>
                            <div className={(tagsDropdown) ? `options active ${styles.wide}` : "options"}>
                                <div>
                                    {tags && Object.keys(tags).map((category) => {
                                        return (
                                            <div>
                                                <h4>{category.charAt(0).toUpperCase() + category.substring(1)}</h4>
                                                <div className={styles.tags_list}>
                                                    {tags[category].map((tag) => <Tag tag={tag} />)}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.search_buttons}>
                    <MainButton className={`${styles.search_button}`} onClick={() => performSearch()}>Search</MainButton>
                    <WarningButton onClick={() => {updateSearch(""); updateSort(SortOptions.Newest); updateStatus(2); setExcludeTags([]); setIncludeTags([])}}>Clear Filters</WarningButton>
                </div>
            </div>
    )
}