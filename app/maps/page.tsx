'use client'
import ContentGrid from "@/components/ContentGrid"
import ContentCard from "@/components/cards/ContentCard"
import Menu from "@/components/Menu"
import { useSearchParams, usePathname } from "next/navigation"
import Link from "next/link"
import { fetchMaps } from "@/app/getData"
import { useEffect, useState } from "react"
import { useCallback } from "react"
import { Filter } from "react-feather"
import Loading from "./loading"
import { IMap, SortOptions, StatusOptions } from "../types"

// const client = contentful.createClient({
//     space: 'xfoauilnv892',
//     accessToken:  process.env.CONTENTFUL_ACCESS_KEY
// })

// async function getMaps() {
//     const res = await client.getEntries({
//         content_type: 'content',
//         'fields.state': 1
//     })

//     return res.items;
// }

export default function Maps() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [maps, setMaps] = useState([])
    const [pages, setPages] = useState(0)
    const [filtering, setFiltering] = useState(false);
    const [search, setSearch] = useState(searchParams.get("search"))
    const [popupOpen, setPopupOpen] = useState(false)
    const [sortDropdown, setSortDropdown] = useState(false)
    const [sort, setSort] = useState(SortOptions.Newest);
    // const [statusDropdown, setStatusDropdown] = useState(false)
    // const [status, setStatus] = useState(StatusOptions.Approved)
    const [loading, setLoading] = useState(false)
    let page: number = 0;
    if(searchParams.get("page") != null) {
       page = (Number.parseInt(searchParams.get("page")!));
    }

    useEffect(() => {
        getPageCount();
        findMaps();
    }, [page, search, sort, status])

    const findMaps = async () => {
        setLoading(true)
        let m = await fetchMaps({sort: sort, limit: 20, skip: (page * 20), search: search!}, false)
        setLoading(false);
        setMaps(m);
    }

    const getPageCount = async () => {
        let count = await fetchMaps({sort: sort, limit: 20, skip: (page * 20), search: search!}, true);
        setPages(Math.ceil(count / 20.0))
    }

    const createQueryString = useCallback(
        (name: string, value: string) => {
          const params = new URLSearchParams(searchParams)
          params.set(name, value)
     
          return params.toString()
        },
        [searchParams]
      )
      

      const goToPage = (page: number) => {
        return pathname + '?' + createQueryString('page', page.toString())
      }

      const closePopups = () => {
        setSortDropdown(false);
        // setStatusDropdown(false)
      }

      if(maps.length == 0 && !search || loading) {
        return (
            <Loading />
        )
      }
    
    return (
        <div onClick={() => {(popupOpen == true) ? closePopups(): false}}>
            <Menu selectedPage='maps'></Menu>
            <div className="search_and_filter" onClick={() => {(popupOpen == true) ? closePopups(): false}}>
                <div className="search_stack">
                    <input type="text" placeholder="Search" className="search" onKeyDown={(e) => {if(e.code == "Enter") {setSearch(e.currentTarget.value); goToPage(0);}}} onChange={(e) => {if(!search || Math.abs(e.target.value.length - search.length) > 2) setSearch(e.target.value); goToPage(0);}}></input>
                    <button className="secondary_button" onClick={() => setFiltering(!filtering)}><Filter /></button>
                </div>
                <div className="filters" style={{display: (filtering) ? "flex": "none"}}>
                    <div className="filter_option">
                        Sort by 
                        <div className="select" onClick={() => {setSortDropdown(true)}}>
                            <button className="selected_option">{sort.charAt(0).toUpperCase() + sort.replaceAll("_", " ").substring(1)}</button>
                            <div className={(sortDropdown) ? "options active" : "options"}>
                                <div className={(sort === SortOptions.Newest) ? "option selected": "option"} onClick={() => setSort(SortOptions.Newest)}>Newest</div>
                                <div className={(sort === SortOptions.Oldest) ? "option selected": "option"} onClick={() => setSort(SortOptions.Oldest)}>Oldest</div>
                                <div className={(sort === SortOptions.Updated) ? "option selected": "option"} onClick={() => setSort(SortOptions.Updated)}>Updated</div>
                                <div className={(sort === SortOptions.TitleAscending) ? "option selected": "option"} onClick={() => setSort(SortOptions.TitleAscending)}>Title Ascending</div>
                                <div className={(sort === SortOptions.TitleDescending) ? "option selected": "option"} onClick={() => setSort(SortOptions.TitleDescending)}>Title Descending</div>
                                <div className={(sort === SortOptions.CreatorAscending) ? "option selected": "option"} onClick={() => setSort(SortOptions.CreatorAscending)}>Creator Ascending</div>
                                <div className={(sort === SortOptions.CreatorDescending) ? "option selected": "option"} onClick={() => setSort(SortOptions.CreatorDescending)}>Creator Descending</div>
                                <div className={(sort === SortOptions.HighestRated) ? "option selected": "option"} onClick={() => setSort(SortOptions.HighestRated)}>Highest Rated</div>
                                <div className={(sort === SortOptions.LowestRated) ? "option selected": "option"} onClick={() => setSort(SortOptions.LowestRated)}>Lowest Rated</div>
                                {/* <div className="option" onClick={() => setSort(SortOptions.BestMatch)}>Best Match</div> */}
                            </div>
                        </div>
                    </div>
                    {/* <div className="filter_option">
                        Status
                        <div className="select" onClick={() => {setStatusDropdown(true)}}>
                                <button className="selected_option">{sort.charAt(0).toUpperCase() + sort.replaceAll("_", " ").substring(1)}</button>
                                <div className={(sortDropdown) ? "options active" : "options"}>
                                    <div className={(status === StatusOptions.Unapproved) ? "option selected": "option"} onClick={() => setStatus(StatusOptions.Unapproved)}>Unapproved</div>
                                    <div className={(status === StatusOptions.Approved) ? "option selected": "option"} onClick={() => setStatus(StatusOptions.Approved)}>Approved</div>
                                    <div className={(status === StatusOptions.Featured) ? "option selected": "option"} onClick={() => setStatus(StatusOptions.Featured)}>Featured</div>
                                </div>
                            </div>
                        </div> */}
                </div>
            </div>
                <div>
                    <ContentGrid content={maps}></ContentGrid>
                </div>
                <div className="navigator">
                    {(page != 0) ? <Link href={goToPage(0)}><img src="/chevs-left.svg"></img></Link> : <></>}
                    {(page != 0) ? <Link href={goToPage(page - 1)}><img src="/chev-left.svg"></img></Link> : <></>}
                    {(page - 3 >= 0) ? (page < pages - 4) ? <Link href={goToPage(page - 3)}>{page - 2}</Link> : <Link className={page == pages-7 ? "current": ""} href={goToPage(pages-7)}>{pages - 6}</Link> : <Link className={page == 0 ? "current": ""} href={goToPage(0)}>{1}</Link>}
                    {(pages > 1) ? (page - 3 >= 0) ? (page < pages - 4) ? <Link href={goToPage(page - 2)}>{page - 1}</Link> : <Link className={page == pages-6 ? "current": ""} href={goToPage(pages-6)}>{pages - 5}</Link> : <Link className={page == 1 ? "current": ""} href={goToPage(1)}>{2}</Link>: <></>}
                    {(pages > 2) ? (page - 3 >= 0) ? (page < pages - 4) ? <Link href={goToPage(page - 1)}>{page}</Link> : <Link className={page == pages-5 ? "current": ""} href={goToPage(pages-5)}>{pages - 4}</Link> : <Link className={page == 2 ? "current": ""} href={goToPage(2)}>{3}</Link>: <></>}
                    {(pages > 3) ? (page - 3 >= 0) ? (page < pages - 4) ? <Link className="current" href={goToPage(page)}>{page + 1}</Link> : <Link className={page == pages-4 ? "current": ""} href={goToPage(pages-4)}>{pages - 3}</Link> : <Link className={page == 3 ? "current": ""} href={goToPage(3)}>{4}</Link>: <></>}
                    {(pages > 4) ? (page - 3 >= 0) ? (page < pages - 4) ? <Link href={goToPage(page +1)}>{page +2}</Link> : <Link className={page == pages-3 ? "current": ""} href={goToPage(pages-3)}>{pages - 2}</Link> : <Link className={page == 4 ? "current": ""} href={goToPage(4)}>{5}</Link>: <></>}
                    {(pages > 5) ? (page - 3 >= 0) ? (page < pages - 4) ? <Link href={goToPage(page +2)}>{page+3}</Link> : <Link className={page == pages-2 ? "current": ""} href={goToPage(pages-2)}>{pages - 1}</Link> : <Link className={page == 5 ? "current": ""} href={goToPage(5)}>{6}</Link>: <></>}
                    {(pages > 6) ? (page - 3 >= 0) ? (page < pages - 4) ? <Link href={goToPage(page+3)}>{page + 4}</Link> : <Link className={page == pages-1 ? "current": ""} href={goToPage(pages-1)}>{pages}</Link> : <Link className={page == 6 ? "current": ""} href={goToPage(6)}>{7}</Link>: <></>}
                    {(pages > 1) ? (page != pages -1) ? <Link href={goToPage(page + 1)}><img src="/chev-right.svg"></img></Link> : <></>: <></>}
                    {(pages > 6) ? (page != pages -1) ? <Link href={goToPage(pages - 1)}><img src="/chevs-right.svg"></img></Link> : <></>: <></>}
                </div>
        </div>
    )
}