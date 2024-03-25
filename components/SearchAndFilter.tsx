import { MinecraftVersion, SortOptions, StatusOptions } from "@/app/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Filter } from "react-feather";
import SecondaryButton from "./Buttons/SecondaryButton";

export default function SearchAndFilter({callback}: {callback: Function}) {
    const searchParams = useSearchParams()
    const [filtering, setFiltering] = useState(false);
    const [search, setSearch] = useState("")
    const [popupOpen, setPopupOpen] = useState(false)
    const [sortDropdown, setSortDropdown] = useState(false)
    const [sort, setSort] = useState(SortOptions.Newest);
    const [statusDropdown, setStatusDropdown] = useState(false)
    const [status, setStatus] = useState(StatusOptions.Approved)
    const [version, setVersion] = useState("")
    const [versionDropdown, setVersionDropdown] = useState(false)
    const [versionFilter, setVersionFilter] = useState("")
    const router = useRouter();


    if(searchParams.get("search") && searchParams.get("search") != null && searchParams.get("search") != search) {
        setSearch(searchParams.get("search")!)
    }
    if(searchParams.get("sort") && searchParams.get("sort") != null && searchParams.get("sort") != sort) {
        setSort(searchParams.get("sort")! as SortOptions)
    }
    if(searchParams.get("status") && searchParams.get("status") != null && Number.parseInt(searchParams.get("status")!) != status) {
        setStatus(Number.parseInt(searchParams.get("status")!))
    }
    if(searchParams.get("version") && searchParams.get("version") != null && searchParams.get("version") != version) {
        setVersion(searchParams.get("version")!);
    }

    const closePopups = () => {
        setSortDropdown(false);
        setStatusDropdown(false);
        setVersionDropdown(false)
        setPopupOpen(false)
    }

    const updateSearch = (search: string) => {
        router.push(`?search=${search}&sort=${sort}&status=${status}&version=${version}`)
        setSearch(search);
        callback(search, sort, status, version);
    }

    const updateSort = (sort: SortOptions) => {
        router.push(`?search=${search}&sort=${sort}&status=${status}&version=${version}`)
        setSort(sort);
        callback(search, sort, status, version);   
    }

    const updateStatus = (stats: StatusOptions) => {
        router.push(`?search=${search}&sort=${sort}&status=${status}&version=${version}`)
        setStatus(status);
        callback(search, sort, status, version); 
    }

    const updateVersion = (version: string) => {
        router.push(`?search=${search}&sort=${sort}&status=${status}&version=${version}`)
        setVersion(version);
        callback(search, sort, status, version); 
    }

    return (
        <div className="search_and_filter" onClick={() => {(popupOpen == true) ? closePopups(): false}}>
                <div className="search_stack">
                    <input type="text" placeholder="Search" className="search" defaultValue={(search) ? search : ""} onKeyDown={(e) => (e.key === "Enter") ? updateSearch(e.currentTarget.value) : false}></input>
                    <SecondaryButton onClick={() => setFiltering(!filtering)}><Filter /></SecondaryButton>
                </div>
                <div className="filters" style={{display: (filtering) ? "flex": "none"}}>
                    <div className="filter_option">
                        Sort by 
                        <div className="select" onClick={() => {setSortDropdown(true); setPopupOpen(true)}}>
                            <button className="selected_option">{sort.charAt(0).toUpperCase() + sort.replaceAll("_", " ").substring(1)}</button>
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
                        Version
                        <div className="select" onClick={() => {setVersionDropdown(true); setPopupOpen(true)}}>
                            <button className="selected_option">{(version === "") ? "None" : version}</button>
                            <div className={(versionDropdown) ? "options active" : "options"}>
                                <input type="text" className={(version === "") ? "option selected": "option"} onChange={(e) => setVersionFilter(e.target.value)} onClick={(e) => {e.preventDefault(); setVersionDropdown(true); setPopupOpen(true)}}></input>
                                <div className={(version === "") ? "option selected": "option"} onClick={() => updateVersion("")}>None</div>
                                {Object.entries(MinecraftVersion).slice(Object.entries(MinecraftVersion).length/2).map((v, idx) => <div key={idx} className={(v[1] === MinecraftVersion[idx]) ? "option selected": "option"} onClick={() => updateVersion(v[0] as string)}>{v[0]}</div>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}